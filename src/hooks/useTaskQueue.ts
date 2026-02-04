// Task Queue hook
import { useState, useEffect, useCallback } from 'react';
import {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
  getTaskStats,
} from '../utils/storage';
import type { Task, TaskTool, TaskStatus } from '../types/storage.types';

interface UseTaskQueueResult {
  tasks: Task[];
  stats: {
    total: number;
    processing: number;
    completed: number;
    failed: number;
  };
  isLoading: boolean;
  createNewTask: (
    tool: TaskTool,
    inputFiles: { name: string; size: number }[]
  ) => Promise<string>;
  completeTask: (
    id: string,
    outputFile: { name: string; size: number; data: Blob }
  ) => Promise<void>;
  failTask: (id: string, error: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  clearAllTasks: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  downloadTaskResult: (task: Task) => void;
}

export const useTaskQueue = (): UseTaskQueueResult => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    processing: 0,
    completed: 0,
    failed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshTasks = useCallback(async () => {
    try {
      const allTasks = await getAllTasks();
      const taskStats = await getTaskStats();
      setTasks(allTasks);
      setStats(taskStats);
    } catch (error) {
      console.error('Failed to refresh tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const createNewTask = useCallback(
    async (
      tool: TaskTool,
      inputFiles: { name: string; size: number }[]
    ): Promise<string> => {
      const taskId = await createTask({
        tool,
        status: 'processing',
        inputFiles,
      });
      await refreshTasks();
      return taskId;
    },
    [refreshTasks]
  );

  const completeTask = useCallback(
    async (
      id: string,
      outputFile: { name: string; size: number; data: Blob }
    ) => {
      await updateTask(id, {
        status: 'completed',
        outputFile,
        completedAt: new Date(),
      });
      await refreshTasks();
    },
    [refreshTasks]
  );

  const failTask = useCallback(
    async (id: string, error: string) => {
      await updateTask(id, {
        status: 'failed',
        error,
        completedAt: new Date(),
      });
      await refreshTasks();
    },
    [refreshTasks]
  );

  const removeTask = useCallback(
    async (id: string) => {
      await deleteTask(id);
      await refreshTasks();
    },
    [refreshTasks]
  );

  const clearAllTasks = useCallback(async () => {
    await deleteAllTasks();
    await refreshTasks();
  }, [refreshTasks]);

  const downloadTaskResult = useCallback((task: Task) => {
    if (!task.outputFile) {
      console.error('No output file for task:', task.id);
      return;
    }

    const url = URL.createObjectURL(task.outputFile.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = task.outputFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return {
    tasks,
    stats,
    isLoading,
    createNewTask,
    completeTask,
    failTask,
    removeTask,
    clearAllTasks,
    refreshTasks,
    downloadTaskResult,
  };
};
