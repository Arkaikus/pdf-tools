// File download utilities
import { saveAs } from 'file-saver';

/**
 * Download file to user's device
 */
export const downloadFile = (data: Uint8Array | Blob, filename: string): void => {
  const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/pdf' });
  saveAs(blob, filename);
};

/**
 * Generate filename with timestamp
 */
export const generateFilename = (prefix: string, extension: string): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${prefix}_${timestamp}.${extension}`;
};
