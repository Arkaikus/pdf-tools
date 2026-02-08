// Pipeline-related type definitions

import type { TaskTool } from './storage.types';

export interface PipedFile {
  name: string;
  blob: Blob;
  type: string;
  size: number;
  sourceTaskId: string;
}

export interface PipelineSession {
  sourceTaskId: string;
  targetTool: TaskTool;
  files: PipedFile[];
  timestamp: number;
}

export interface PipelineMetadata {
  sourceTaskId?: string;      // Parent task (if piped from)
  pipedToTasks?: string[];    // Child tasks (if piped to)
  pipeHistory?: string[];     // Full chain: [taskA, taskB, taskC]
}
