// Global type definitions

export {};

declare global {
  interface Window {
    // Add any window extensions here
  }
}

// File types
export interface FileWithPreview extends File {
  preview?: string;
  id?: string;
}

// App types
export type Theme = 'light' | 'dark' | 'system';
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
