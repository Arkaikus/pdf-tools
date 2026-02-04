// IndexedDB wrapper for file storage
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { StoredFile, LogEntry, Task, TaskStatus } from '../../types/storage.types';

interface PDFToolsDB extends DBSchema {
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

const DB_NAME = 'pdf-tools-db';
const DB_VERSION = 2; // Incremented for schema change
const EXPIRY_HOURS = 24;

let dbInstance: IDBPDatabase<PDFToolsDB> | null = null;

/**
 * Initialize and get the database instance
 */
export const getDB = async (): Promise<IDBPDatabase<PDFToolsDB>> => {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<PDFToolsDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      // Create files store
      if (!db.objectStoreNames.contains('files')) {
        const fileStore = db.createObjectStore('files', { keyPath: 'id' });
        fileStore.createIndex('by-expiry', 'expiresAt');
      }

      // Create tasks store (v2)
      if (!db.objectStoreNames.contains('tasks')) {
        const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
        taskStore.createIndex('by-status', 'status');
        taskStore.createIndex('by-expiry', 'expiresAt');
        taskStore.createIndex('by-created', 'createdAt');
      }

      // Create logs store
      if (!db.objectStoreNames.contains('logs')) {
        const logStore = db.createObjectStore('logs', { keyPath: 'id' });
        logStore.createIndex('by-timestamp', 'timestamp');
      }
    },
  });

  // Clean up expired files and tasks on init
  await cleanupExpiredFiles();
  await cleanupExpiredTasks();

  return dbInstance;
};

/**
 * Store a file in IndexedDB
 */
export const storeFile = async (
  file: File | Blob,
  metadata?: Record<string, any>
): Promise<string> => {
  const db = await getDB();
  const id = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + EXPIRY_HOURS * 60 * 60 * 1000);

  const storedFile: StoredFile = {
    id,
    name: file instanceof File ? file.name : 'blob',
    size: file.size,
    type: file.type,
    data: await file.arrayBuffer(),
    createdAt: now,
    expiresAt,
    metadata,
  };

  await db.add('files', storedFile);
  return id;
};

/**
 * Retrieve a file from IndexedDB
 */
export const getFile = async (id: string): Promise<StoredFile | undefined> => {
  const db = await getDB();
  return await db.get('files', id);
};

/**
 * Get all files from IndexedDB
 */
export const getAllFiles = async (): Promise<StoredFile[]> => {
  const db = await getDB();
  return await db.getAll('files');
};

/**
 * Delete a file from IndexedDB
 */
export const deleteFile = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete('files', id);
};

/**
 * Delete all files from IndexedDB
 */
export const deleteAllFiles = async (): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction('files', 'readwrite');
  await tx.store.clear();
  await tx.done;
};

/**
 * Clean up expired files
 */
export const cleanupExpiredFiles = async (): Promise<number> => {
  const db = await getDB();
  const now = new Date();
  const tx = db.transaction('files', 'readwrite');
  const index = tx.store.index('by-expiry');
  
  let deletedCount = 0;
  let cursor = await index.openCursor(IDBKeyRange.upperBound(now));

  while (cursor) {
    await cursor.delete();
    deletedCount++;
    cursor = await cursor.continue();
  }

  await tx.done;
  return deletedCount;
};

/**
 * Get total storage usage
 */
export const getStorageUsage = async (): Promise<{
  used: number;
  total: number;
  files: number;
}> => {
  const db = await getDB();
  const files = await db.getAll('files');
  
  const used = files.reduce((sum, file) => sum + file.size, 0);
  const fileCount = files.length;

  // Estimate based on IndexedDB (browsers typically allow 50% of available disk space)
  const estimate = await navigator.storage?.estimate();
  const total = estimate?.quota || 0;

  return {
    used,
    total,
    files: fileCount,
  };
};

/**
 * Log an event to IndexedDB
 */
export const logEvent = async (
  level: 'info' | 'warn' | 'error',
  message: string,
  context?: Record<string, any>
): Promise<void> => {
  const db = await getDB();
  const id = crypto.randomUUID();

  const logEntry: LogEntry = {
    id,
    level,
    message,
    context,
    timestamp: new Date(),
  };

  await db.add('logs', logEntry);

  // Keep only last 1000 logs
  const allLogs = await db.getAllKeys('logs');
  if (allLogs.length > 1000) {
    const toDelete = allLogs.slice(0, allLogs.length - 1000);
    const tx = db.transaction('logs', 'readwrite');
    for (const key of toDelete) {
      await tx.store.delete(key);
    }
    await tx.done;
  }
};

/**
 * Get recent logs
 */
export const getLogs = async (limit = 100): Promise<LogEntry[]> => {
  const db = await getDB();
  const allLogs = await db.getAll('logs');
  return allLogs.slice(-limit).reverse();
};

/**
 * Clear all logs
 */
export const clearLogs = async (): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction('logs', 'readwrite');
  await tx.store.clear();
  await tx.done;
};

// ==================== TASK QUEUE OPERATIONS ====================

/**
 * Generate a random 5-character task ID
 */
export const generateTaskId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

/**
 * Create a new task
 */
export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'expiresAt'>): Promise<string> => {
  const db = await getDB();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + EXPIRY_HOURS * 60 * 60 * 1000);
  
  // Ensure unique ID
  let taskId = generateTaskId();
  let attempts = 0;
  while (await db.get('tasks', taskId) && attempts < 10) {
    taskId = generateTaskId();
    attempts++;
  }

  const newTask: Task = {
    ...task,
    id: taskId,
    createdAt: now,
    expiresAt,
  };

  await db.add('tasks', newTask);
  return taskId;
};

/**
 * Get a task by ID
 */
export const getTask = async (id: string): Promise<Task | undefined> => {
  const db = await getDB();
  return await db.get('tasks', id);
};

/**
 * Get all tasks
 */
export const getAllTasks = async (): Promise<Task[]> => {
  const db = await getDB();
  const tasks = await db.getAll('tasks');
  // Sort by created date, newest first
  return tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

/**
 * Get tasks by status
 */
export const getTasksByStatus = async (status: TaskStatus): Promise<Task[]> => {
  const db = await getDB();
  const index = db.transaction('tasks').store.index('by-status');
  return await index.getAll(status);
};

/**
 * Update a task
 */
export const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
  const db = await getDB();
  const task = await db.get('tasks', id);
  if (!task) {
    throw new Error(`Task ${id} not found`);
  }

  const updatedTask = { ...task, ...updates };
  await db.put('tasks', updatedTask);
};

/**
 * Delete a task
 */
export const deleteTask = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete('tasks', id);
};

/**
 * Delete all tasks
 */
export const deleteAllTasks = async (): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction('tasks', 'readwrite');
  await tx.store.clear();
  await tx.done;
};

/**
 * Clean up expired tasks
 */
export const cleanupExpiredTasks = async (): Promise<number> => {
  const db = await getDB();
  const now = new Date();
  const tx = db.transaction('tasks', 'readwrite');
  const index = tx.store.index('by-expiry');
  
  let deletedCount = 0;
  let cursor = await index.openCursor(IDBKeyRange.upperBound(now));

  while (cursor) {
    await cursor.delete();
    deletedCount++;
    cursor = await cursor.continue();
  }

  await tx.done;
  return deletedCount;
};

/**
 * Get task statistics
 */
export const getTaskStats = async (): Promise<{
  total: number;
  processing: number;
  completed: number;
  failed: number;
}> => {
  const db = await getDB();
  const allTasks = await db.getAll('tasks');

  return {
    total: allTasks.length,
    processing: allTasks.filter((t) => t.status === 'processing').length,
    completed: allTasks.filter((t) => t.status === 'completed').length,
    failed: allTasks.filter((t) => t.status === 'failed').length,
  };
};
