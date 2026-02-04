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

export interface DBSchema {
  files: {
    key: string;
    value: StoredFile;
    indexes: { 'by-expiry': Date };
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
