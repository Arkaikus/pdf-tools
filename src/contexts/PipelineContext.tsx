// Pipeline Context for managing task piping across tools

import React, { createContext, useContext, useState, useCallback, useEffect, FC, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { PipedFile, PipelineSession } from '../types/pipeline.types';
import type { Task, TaskTool } from '../types/storage.types';
import {
  savePipelineSession,
  loadPipelineSession,
  clearPipelineSession as clearSession,
  createPipedFilesFromTask,
  getTargetToolFromPath,
} from '../utils/pipeline';

interface PipelineContextValue {
  pipedFiles: PipedFile[];
  sourceTaskId: string | null;
  isPiping: boolean;
  pipeTask: (task: Task, targetTool: TaskTool) => Promise<void>;
  clearPipedFiles: () => void;
  hasPipedFiles: boolean;
}

const PipelineContext = createContext<PipelineContextValue | undefined>(undefined);

interface PipelineProviderProps {
  children: ReactNode;
}

export const PipelineProvider: FC<PipelineProviderProps> = ({ children }) => {
  const [pipedFiles, setPipedFiles] = useState<PipedFile[]>([]);
  const [sourceTaskId, setSourceTaskId] = useState<string | null>(null);
  const [isPiping, setIsPiping] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load pipeline session on mount and when location changes
  useEffect(() => {
    const loadSession = async () => {
      const session = await loadPipelineSession();
      
      if (!session) {
        return;
      }

      // Check if we're on the target tool page
      const currentTool = getTargetToolFromPath(location.pathname);
      
      if (currentTool === session.targetTool) {
        // We're on the target tool, load the piped files
        setPipedFiles(session.files);
        setSourceTaskId(session.sourceTaskId);
        setIsPiping(false);
        
        // Clear session after loading (one-time use)
        // Delay slightly to ensure component can read the files
        setTimeout(() => {
          clearSession();
        }, 100);
      } else if (currentTool !== session.targetTool && session.files.length > 0) {
        // We're not on the target tool yet, keep the session
        // This handles the case where user navigates away before reaching target
      }
    };

    loadSession();
  }, [location.pathname]);

  /**
   * Pipe a task result to another tool
   */
  const pipeTask = useCallback(async (task: Task, targetTool: TaskTool): Promise<void> => {
    try {
      setIsPiping(true);

      // Create piped files from task output
      const files = createPipedFilesFromTask(task);
      
      if (files.length === 0) {
        console.error('No output file in task:', task.id);
        setIsPiping(false);
        return;
      }

      // Save pipeline session
      const session: PipelineSession = {
        sourceTaskId: task.id,
        targetTool,
        files,
        timestamp: Date.now(),
      };

      savePipelineSession(session);

      // Navigate to target tool
      const toolPaths: Record<TaskTool, string> = {
        'merge-pdf': '/merge-pdf',
        'organize-pdf': '/organize-pdf',
        'jpg-to-pdf': '/jpg-to-pdf',
      };

      navigate(toolPaths[targetTool]);
    } catch (error) {
      console.error('Failed to pipe task:', error);
      setIsPiping(false);
    }
  }, [navigate]);

  /**
   * Clear piped files from state
   */
  const clearPipedFiles = useCallback(() => {
    setPipedFiles([]);
    setSourceTaskId(null);
    clearSession();
  }, []);

  const value: PipelineContextValue = {
    pipedFiles,
    sourceTaskId,
    isPiping,
    pipeTask,
    clearPipedFiles,
    hasPipedFiles: pipedFiles.length > 0,
  };

  return (
    <PipelineContext.Provider value={value}>
      {children}
    </PipelineContext.Provider>
  );
};

/**
 * Hook to use pipeline context
 */
export const usePipeline = (): PipelineContextValue => {
  const context = useContext(PipelineContext);
  if (context === undefined) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
};
