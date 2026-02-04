// Storage-related type definitions

export interface StoredFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data: ArrayBuffer;
  createdAt: Date;
  expiresAt: Date;
  metadata?: Record<string, any>;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  defaultQuality: 'low' | 'medium' | 'high';
  autoDownload: boolean;
  recentTools: string[];
  maxFileSize: number;
}

export type TaskStatus = 'processing' | 'completed' | 'failed';
export type TaskTool = 'jpg-to-pdf' | 'merge-pdf' | 'organize-pdf';

export interface Task {
  id: string; // 5-character unique ID
  tool: TaskTool;
  status: TaskStatus;
  inputFiles: {
    name: string;
    size: number;
  }[];
  outputFile?: {
    name: string;
    size: number;
    data: Blob;
  };
  error?: string;
  createdAt: Date;
  completedAt?: Date;
  expiresAt: Date;
}

export interface DBSchema {
  files: {
    key: string;
    value: StoredFile;
    indexes: { 'by-expiry': Date };
  };
  tasks: {
    key: string;
    value: Task;
    indexes: { 
      'by-status': TaskStatus;
      'by-expiry': Date;
      'by-created': Date;
    };
  };
  logs: {
    key: string;
    value: LogEntry;
    indexes: { 'by-timestamp': Date };
  };
}

export interface LogEntry {
  id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
  timestamp: Date;
}
