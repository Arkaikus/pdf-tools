import { useState, useCallback, useEffect } from 'react';
import { convertImagesToPDF } from '../../../utils/pdf';
import { downloadFile, generateFilename, validateImageFile } from '../../../utils/file';
import { useTaskQueue } from '../../../hooks/useTaskQueue';
import { usePipeline } from '../../../contexts/PipelineContext';
import { useToast } from '../../../contexts/ToastContext';
import { pipedFilesToFiles } from '../../../utils/pipeline';
import type { ImageToPDFOptions } from '../../../types/pdf.types';
import type { FileWithPreview } from '../../../types/global.d';

interface UseImageToPDFResult {
  files: FileWithPreview[];
  isProcessing: boolean;
  progress: number;
  error: string | null;
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  reorderFiles: (fromIndex: number, toIndex: number) => void;
  clearFiles: () => void;
  convertToPDF: (options?: ImageToPDFOptions) => Promise<void>;
}

export const useImageToPDF = (): UseImageToPDFResult => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { createNewTask, completeTask, failTask } = useTaskQueue();
  const { pipedFiles, sourceTaskId, clearPipedFiles } = usePipeline();
  const { addToast } = useToast();

  // Handle piped files from task queue (for future image piping support)
  useEffect(() => {
    if (pipedFiles.length > 0) {
      const loadPipedFiles = async () => {
        try {
          const fileObjects = pipedFilesToFiles(pipedFiles);
          
          // Filter only image files
          const imageFiles = fileObjects.filter(file => 
            file.type.startsWith('image/')
          );
          
          if (imageFiles.length > 0) {
            addFiles(imageFiles);
            
            addToast('success', `Added ${imageFiles.length} image(s) from task ${sourceTaskId}`);
          } else {
            addToast('warning', 'Piped files are not images. Please upload image files.');
          }
          
          clearPipedFiles();
        } catch (err) {
          console.error('Failed to load piped files:', err);
          addToast('error', 'Failed to load piped files');
        }
      };

      loadPipedFiles();
    }
  }, [pipedFiles, sourceTaskId, clearPipedFiles, addToast]);

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

  const reorderFiles = useCallback((fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
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

      let taskId: string | null = null;

      try {
        // Create task with pipeline metadata if available
        taskId = await createNewTask(
          'jpg-to-pdf',
          files.map((f) => ({ name: f.name, size: f.size })),
          sourceTaskId ? { sourceTaskId } : undefined
        );

        // Convert images to PDF
        setProgress(50);
        const pdfBytes = await convertImagesToPDF(files, options);

        // Create filename and blob
        setProgress(80);
        const filename = generateFilename('images', 'pdf');
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        // Complete task
        await completeTask(taskId, {
          name: filename,
          size: blob.size,
          data: blob,
        });

        // Download PDF
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
        
        // Fail task
        if (taskId) {
          await failTask(taskId, errorMessage);
        }
        
        setProgress(0);
      } finally {
        setIsProcessing(false);
      }
    },
    [files, clearFiles, createNewTask, completeTask, failTask]
  );

  return {
    files,
    isProcessing,
    progress,
    error,
    addFiles,
    removeFile,
    reorderFiles,
    clearFiles,
    convertToPDF,
  };
};
