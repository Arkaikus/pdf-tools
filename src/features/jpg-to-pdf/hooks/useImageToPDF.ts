import { useState, useCallback } from 'react';
import { convertImagesToPDF } from '../../../utils/pdf';
import { downloadFile, generateFilename, validateImageFile } from '../../../utils/file';
import type { ImageToPDFOptions } from '../../../types/pdf.types';
import type { FileWithPreview } from '../../../types/global.d';

interface UseImageToPDFResult {
  files: FileWithPreview[];
  isProcessing: boolean;
  progress: number;
  error: string | null;
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  convertToPDF: (options?: ImageToPDFOptions) => Promise<void>;
}

export const useImageToPDF = (): UseImageToPDFResult => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback((newFiles: File[]) => {
    const validFiles: FileWithPreview[] = [];

    newFiles.forEach((file) => {
      const validation = validateImageFile(file);
      if (validation.valid) {
        const fileWithPreview = Object.assign(file, {
          id: crypto.randomUUID(),
          preview: URL.createObjectURL(file),
        });
        validFiles.push(fileWithPreview);
      } else {
        setError(validation.error || 'Invalid file');
      }
    });

    setFiles((prev) => [...prev, ...validFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearFiles = useCallback(() => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
  }, [files]);

  const convertToPDF = useCallback(
    async (options?: ImageToPDFOptions) => {
      if (files.length === 0) {
        setError('No files to convert');
        return;
      }

      setIsProcessing(true);
      setProgress(0);
      setError(null);

      try {
        // Convert images to PDF
        setProgress(50);
        const pdfBytes = await convertImagesToPDF(files, options);

        // Download PDF
        setProgress(80);
        const filename = generateFilename('images', 'pdf');
        downloadFile(pdfBytes, filename);

        setProgress(100);

        // Clear files after successful conversion
        setTimeout(() => {
          clearFiles();
          setProgress(0);
        }, 1000);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to convert images';
        setError(errorMessage);
        setProgress(0);
      } finally {
        setIsProcessing(false);
      }
    },
    [files, clearFiles]
  );

  return {
    files,
    isProcessing,
    progress,
    error,
    addFiles,
    removeFile,
    clearFiles,
    convertToPDF,
  };
};
