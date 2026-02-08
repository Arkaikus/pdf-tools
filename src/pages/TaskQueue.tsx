import React, { type FC } from 'react';
import { 
  FaDownload, 
  FaTrash, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaImage,
  FaFileAlt,
  FaTh,
  FaInfoCircle,
  FaLink
} from 'react-icons/fa';
import { useTaskQueue } from '../hooks/useTaskQueue';
import { usePipeline } from '../contexts/PipelineContext';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { TaskActionMenu } from '../components/common/TaskActionMenu';
import { formatBytes, formatRelativeTime, pluralize } from '../utils/helpers';
import type { Task, TaskTool } from '../types/storage.types';

const toolIcons = {
  'jpg-to-pdf': <FaImage className="w-5 h-5 text-primary-600" />,
  'merge-pdf': <FaFileAlt className="w-5 h-5 text-primary-600" />,
  'organize-pdf': <FaTh className="w-5 h-5 text-primary-600" />,
};

const toolNames = {
  'jpg-to-pdf': 'JPG to PDF',
  'merge-pdf': 'Merge PDF',
  'organize-pdf': 'Organize PDF',
};

const statusIcons = {
  processing: <FaSpinner className="w-5 h-5 text-blue-500 animate-spin" />,
  completed: <FaCheckCircle className="w-5 h-5 text-green-500" />,
  failed: <FaExclamationCircle className="w-5 h-5 text-red-500" />,
};

const statusColors = {
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
};

export const TaskQueue: FC = () => {
  const {
    tasks,
    stats,
    isLoading,
    removeTask,
    clearAllTasks,
    downloadTaskResult,
  } = useTaskQueue();
  
  const { pipeTask, isPiping } = usePipeline();
  const { addToast } = useToast();

  const handlePipeTask = async (task: Task, targetTool: TaskTool) => {
    try {
      await pipeTask(task, targetTool);
      addToast('info', 'Redirecting to tool with piped file...');
    } catch (error) {
      console.error('Failed to pipe task:', error);
      addToast('error', 'Failed to pipe task result');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Task Queue</h1>
        <p className="text-lg text-gray-600">
          View and manage your PDF processing tasks. Results are stored for 24 hours on your browser.
          <br />
          No data is stored on our servers.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-soft p-4">
          <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <p className="text-sm text-blue-600 mb-1">Processing</p>
          <p className="text-2xl font-bold text-blue-700">{stats.processing}</p>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <p className="text-sm text-green-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <p className="text-sm text-red-600 mb-1">Failed</p>
          <p className="text-2xl font-bold text-red-700">{stats.failed}</p>
        </div>
      </div>

      {/* Actions */}
      {tasks.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            Tasks automatically expire after 24 hours
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllTasks}
          >
            Clear All Tasks
          </Button>
        </div>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <FaInfoCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tasks yet
          </h3>
          <p className="text-gray-600">
            Tasks will appear here when you convert or merge PDFs
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDownload={downloadTaskResult}
              onRemove={removeTask}
              onPipeToTool={(tool) => handlePipeTask(task, tool)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  onDownload: (task: Task) => void;
  onRemove: (id: string) => void;
  onPipeToTool: (tool: TaskTool) => void;
}

const TaskCard: FC<TaskCardProps> = ({ task, onDownload, onRemove, onPipeToTool }) => {
  // Determine available pipeline actions
  const availableActions: { tool: TaskTool; label: string; icon: React.ReactNode }[] = [];
  
  if (task.status === 'completed' && task.outputFile?.name.endsWith('.pdf')) {
    if (task.tool !== 'merge-pdf') {
      availableActions.push({
        tool: 'merge-pdf',
        label: 'Merge PDF',
        icon: <FaFileAlt className="w-4 h-4" />,
      });
    }
    if (task.tool !== 'organize-pdf') {
      availableActions.push({
        tool: 'organize-pdf',
        label: 'Organize PDF',
        icon: <FaTh className="w-4 h-4" />,
      });
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
        {/* Left Column - Task Info */}
        <div className="flex items-start gap-4 min-w-0">
          {/* Icon */}
          <div className="shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            {toolIcons[task.tool]}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-gray-900">{toolNames[task.tool]}</h3>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">
                    {task.id}
                  </span>
                  {task.pipelineMetadata?.sourceTaskId && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1">
                      <FaLink className="w-3 h-3" />
                      From: {task.pipelineMetadata.sourceTaskId}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {formatRelativeTime(task.createdAt)}
                  {task.completedAt && task.status === 'completed' && (
                    <> • Completed {formatRelativeTime(task.completedAt)}</>
                  )}
                </p>
              </div>

              {/* Status Badge - Mobile Only */}
              <div className="md:hidden">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusColors[task.status]}`}>
                  {statusIcons[task.status]}
                  <span className="text-sm font-medium capitalize">{task.status}</span>
                </div>
              </div>
            </div>

            {/* Input Files */}
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Input Files:</p>
              <div className="flex flex-wrap gap-2">
                {task.inputFiles.map((file, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                  >
                    {file.name} ({formatBytes(file.size)})
                  </span>
                ))}
              </div>
            </div>

            {/* Output File */}
            {task.outputFile && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Output:</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  {task.outputFile.name} ({formatBytes(task.outputFile.size)})
                </span>
              </div>
            )}

            {/* Error */}
            {task.error && (
              <div className="mb-3 bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm text-red-800">{task.error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4">
              {task.status === 'completed' && task.outputFile && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onDownload(task)}
                  leftIcon={<FaDownload />}
                >
                  Download
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(task.id)}
                leftIcon={<FaTrash />}
              >
                Remove
              </Button>
              
              {/* Mobile: Show action menu if actions available */}
              <div className="md:hidden ml-auto">
                <TaskActionMenu task={task} onPipeToTool={onPipeToTool} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - What's Next Section (Desktop Only) */}
        {availableActions.length > 0 && (
          <div className="hidden md:flex flex-col gap-3 pl-6 min-w-[240px]">
            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-2">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusColors[task.status]}`}>
                {statusIcons[task.status]}
                <span className="text-sm font-medium capitalize">{task.status}</span>
              </div>
            </div>

            {/* What's Next Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">What's next?</h4>
              <div className="space-y-2">
                {availableActions.map((action) => (
                  <button
                    key={action.tool}
                    onClick={() => onPipeToTool(action.tool)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-lg transition-colors group text-left"
                  >
                    <div className="shrink-0 w-8 h-8 bg-white group-hover:bg-primary-100 border border-gray-200 group-hover:border-primary-300 rounded-lg flex items-center justify-center text-gray-600 group-hover:text-primary-600 transition-colors">
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                        {action.label}
                      </div>
                      <div className="text-xs text-gray-500 group-hover:text-primary-600 mt-0.5">
                        Use result in this tool
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
