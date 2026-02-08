// Pipeline management utilities for piping task results between tools

import type { PipelineSession, PipedFile } from '../../types/pipeline.types';
import type { Task, TaskTool } from '../../types/storage.types';

const PIPELINE_SESSION_KEY = 'pdf-tools-pipeline-session';

/**
 * Save a pipeline session to SessionStorage
 */
export const savePipelineSession = (session: PipelineSession): void => {
  try {
    sessionStorage.setItem(PIPELINE_SESSION_KEY, JSON.stringify({
      ...session,
      files: session.files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        sourceTaskId: file.sourceTaskId,
        // Store blob as data URL for persistence
        blobUrl: URL.createObjectURL(file.blob),
      })),
    }));
  } catch (error) {
    console.error('Failed to save pipeline session:', error);
    throw error;
  }
};

/**
 * Load a pipeline session from SessionStorage
 */
export const loadPipelineSession = async (): Promise<PipelineSession | null> => {
  try {
    const sessionData = sessionStorage.getItem(PIPELINE_SESSION_KEY);
    if (!sessionData) {
      return null;
    }

    const session = JSON.parse(sessionData);
    
    // Convert blob URLs back to blobs
    const files: PipedFile[] = await Promise.all(
      session.files.map(async (fileData: any) => {
        const response = await fetch(fileData.blobUrl);
        const blob = await response.blob();
        
        return {
          name: fileData.name,
          type: fileData.type,
          size: fileData.size,
          sourceTaskId: fileData.sourceTaskId,
          blob,
        };
      })
    );

    return {
      sourceTaskId: session.sourceTaskId,
      targetTool: session.targetTool,
      timestamp: session.timestamp,
      files,
    };
  } catch (error) {
    console.error('Failed to load pipeline session:', error);
    return null;
  }
};

/**
 * Clear the pipeline session from SessionStorage
 */
export const clearPipelineSession = (): void => {
  try {
    // Revoke all blob URLs before clearing
    const sessionData = sessionStorage.getItem(PIPELINE_SESSION_KEY);
    if (sessionData) {
      const session = JSON.parse(sessionData);
      session.files?.forEach((file: any) => {
        if (file.blobUrl) {
          URL.revokeObjectURL(file.blobUrl);
        }
      });
    }
    sessionStorage.removeItem(PIPELINE_SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear pipeline session:', error);
  }
};

/**
 * Check if there's an active pipeline session
 */
export const hasPipelineSession = (): boolean => {
  return sessionStorage.getItem(PIPELINE_SESSION_KEY) !== null;
};

/**
 * Create piped files from a task's output
 */
export const createPipedFilesFromTask = (task: Task): PipedFile[] => {
  if (!task.outputFile) {
    return [];
  }

  return [{
    name: task.outputFile.name,
    blob: task.outputFile.data,
    type: task.outputFile.data.type,
    size: task.outputFile.size,
    sourceTaskId: task.id,
  }];
};

/**
 * Convert PipedFile to File object for component use
 */
export const pipedFileToFile = (pipedFile: PipedFile): File => {
  return new File([pipedFile.blob], pipedFile.name, {
    type: pipedFile.type,
    lastModified: Date.now(),
  });
};

/**
 * Convert multiple PipedFiles to File objects
 */
export const pipedFilesToFiles = (pipedFiles: PipedFile[]): File[] => {
  return pipedFiles.map(pipedFileToFile);
};

/**
 * Get the target tool from current pathname
 */
export const getTargetToolFromPath = (pathname: string): TaskTool | null => {
  if (pathname.includes('merge-pdf')) return 'merge-pdf';
  if (pathname.includes('organize-pdf')) return 'organize-pdf';
  if (pathname.includes('jpg-to-pdf')) return 'jpg-to-pdf';
  return null;
};
