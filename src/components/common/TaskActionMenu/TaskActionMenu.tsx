import { FC, useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaArrowRight, FaTh, FaFileAlt } from 'react-icons/fa';
import clsx from 'clsx';
import type { Task, TaskTool } from '../../../types/storage.types';

interface TaskActionMenuProps {
  task: Task;
  onPipeToTool: (tool: TaskTool) => void;
}

export const TaskActionMenu: FC<TaskActionMenuProps> = ({ task, onPipeToTool }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Don't show menu if task failed or is processing
  if (task.status !== 'completed') {
    return null;
  }

  // Determine available actions based on task type and output
  const availableActions: { tool: TaskTool; label: string; icon: JSX.Element; description: string }[] = [];

  // PDF output can be piped to merge or organize
  if (task.outputFile?.name.endsWith('.pdf')) {
    if (task.tool !== 'merge-pdf') {
      availableActions.push({
        tool: 'merge-pdf',
        label: 'Merge PDF',
        icon: <FaFileAlt className="w-4 h-4" />,
        description: 'Add to merge with other PDFs',
      });
    }
    if (task.tool !== 'organize-pdf') {
      availableActions.push({
        tool: 'organize-pdf',
        label: 'Organize PDF',
        icon: <FaTh className="w-4 h-4" />,
        description: 'Reorganize pages',
      });
    }
  }

  // If no actions available, don't show the menu
  if (availableActions.length === 0) {
    return null;
  }

  const handleActionClick = (tool: TaskTool) => {
    onPipeToTool(tool);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="More actions"
      >
        <FaEllipsisV className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
              Use result in
            </div>
            {availableActions.map((action) => (
              <button
                key={action.tool}
                onClick={() => handleActionClick(action.tool)}
                className={clsx(
                  'w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left'
                )}
              >
                <div className="shrink-0 w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{action.label}</span>
                    <FaArrowRight className="w-3 h-3 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
