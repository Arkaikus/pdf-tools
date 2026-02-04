// PDF-related type definitions

export interface PDFFile {
  id: string;
  name: string;
  size: number;
  data: ArrayBuffer;
  pageCount: number;
  createdAt: Date;
}

export interface PDFPage {
  id: string;
  pageNumber: number;
  thumbnail?: string;
  rotation: number;
  width: number;
  height: number;
}

export interface PDFProcessingOptions {
  quality?: 'low' | 'medium' | 'high';
  compression?: boolean;
  pageSize?: 'A4' | 'Letter' | 'Legal' | 'Custom';
  orientation?: 'portrait' | 'landscape';
  margin?: number;
}

export interface ImageToPDFOptions extends PDFProcessingOptions {
  fitToPage?: boolean;
  maintainAspectRatio?: boolean;
  dpi?: number;
}

export interface MergePDFOptions {
  includeBookmarks?: boolean;
  pageRanges?: Record<string, string>; // fileId -> range (e.g., "1-3,5,7-10")
}

export interface OrganizePDFOptions {
  pages?: number[];
  rotations?: Record<number, number>; // pageNumber -> rotation
  deletePages?: number[];
}

export type PDFOperation = 
  | 'jpg-to-pdf'
  | 'merge-pdf'
  | 'organize-pdf'
  | 'split-pdf'
  | 'compress-pdf'
  | 'pdf-to-jpg';

export interface PDFError {
  type: 'INVALID_FILE' | 'CORRUPTED_PDF' | 'MEMORY_ERROR' | 'PROCESSING_ERROR' | 'NETWORK_ERROR';
  message: string;
  userMessage: string;
}
