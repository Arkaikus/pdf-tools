import { useState, useCallback, useEffect } from 'react';
import { mergePDFs, getPDFPageCount } from '../../../utils/pdf';
import { downloadFile, generateFilename, validatePDFFile } from '../../../utils/file';
import { useTaskQueue } from '../../../hooks/useTaskQueue';
import { usePipeline } from '../../../contexts/PipelineContext';
import { useToast } from '../../../contexts/ToastContext';
import { pipedFilesToFiles } from '../../../utils/pipeline';
import type { MergePDFOptions, PDFFile } from '../../../types/pdf.types';

interface PDFFileWithPages extends PDFFile {
  pageRange?: string;
}

interface UsePDFMergerResult {
  files: PDFFileWithPages[];
  isProcessing: boolean;
  progress: number;
  error: string | null;
  addFiles: (newFiles: File[]) => Promise<void>;
  removeFile: (id: string) => void;
  reorderFiles: (fromIndex: number, toIndex: number) => void;
  updatePageRange: (id: string, range: string) => void;
  clearFiles: () => void;
  mergePDFs: () => Promise<void>;
}

export const usePDFMerger = (): UsePDFMergerResult => {
  const [files, setFiles] = useState<PDFFileWithPages[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { createNewTask, completeTask, failTask } = useTaskQueue();
  const { pipedFiles, sourceTaskId, clearPipedFiles } = usePipeline();
  const { addToast } = useToast();

  // Handle piped files from task queue
  useEffect(() => {
    if (pipedFiles.length > 0) {
      const loadPipedFiles = async () => {
        try {
          const fileObjects = pipedFilesToFiles(pipedFiles);
          await addFiles(fileObjects);
          
          addToast('success', `Added ${fileObjects.length} file(s) from task ${sourceTaskId}`);
          
          clearPipedFiles();
        } catch (err) {
          console.error('Failed to load piped files:', err);
          addToast('error', 'Failed to load piped files');
        }
      };

      loadPipedFiles();
    }
  }, [pipedFiles, sourceTaskId, clearPipedFiles, addToast]);

  const addFiles = useCallback(async (newFiles: File[]) => {
    const validFiles: PDFFileWithPages[] = [];
    
    for (const file of newFiles) {
      const validation = validatePDFFile(file);
      if (validation.valid) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pageCount = await getPDFPageCount(file);
          
          const pdfFile: PDFFileWithPages = {
            id: crypto.randomUUID(),
            name: file.name,
            size: file.size,
            data: arrayBuffer,
            pageCount,
            createdAt: new Date(),
            pageRange: 'all',
          };
          
          validFiles.push(pdfFile);
        } catch (err) {
          setError(`Failed to load ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      } else {
        setError(validation.error || 'Invalid file');
      }
    }

    setFiles((prev) => [...prev, ...validFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const reorderFiles = useCallback((fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
  }, []);

  const updatePageRange = useCallback((id: string, range: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, pageRange: range } : f))
    );
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const mergePDFsHandler = useCallback(async () => {
    if (files.length === 0) {
      setError('No files to merge');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    let taskId: string | null = null;

    try {
      // Create task with pipeline metadata if available
      taskId = await createNewTask(
        'merge-pdf',
        files.map((f) => ({ name: f.name, size: f.size })),
        sourceTaskId ? { sourceTaskId } : undefined
      );

      // Convert PDFFile back to File objects
      const fileObjects = files.map((f) => {
        const blob = new Blob([f.data], { type: 'application/pdf' });
        return new File([blob], f.name, { type: 'application/pdf' });
      });

      // Build page ranges
      const pageRanges: Record<string, string> = {};
      files.forEach((f, index) => {
        const fileId = `file-${index}`;
        pageRanges[fileId] = f.pageRange || 'all';
      });

      const options: MergePDFOptions = { pageRanges };

      // Merge PDFs
      setProgress(30);
      const mergedPdfBytes = await mergePDFs(fileObjects, options);

      // Create filename and blob
      setProgress(80);
      const filename = generateFilename('merged', 'pdf');
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

      // Complete task
      await completeTask(taskId, {
        name: filename,
        size: blob.size,
        data: blob,
      });

      // Download merged PDF
      downloadFile(mergedPdfBytes, filename);

      setProgress(100);

      // Clear files after successful merge
      setTimeout(() => {
        clearFiles();
        setProgress(0);
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to merge PDFs';
      setError(errorMessage);
      
      // Fail task
      if (taskId) {
        await failTask(taskId, errorMessage);
      }
      
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  }, [files, clearFiles, createNewTask, completeTask, failTask]);

  return {
    files,
    isProcessing,
    progress,
    error,
    addFiles,
    removeFile,
    reorderFiles,
    updatePageRange,
    clearFiles,
    mergePDFs: mergePDFsHandler,
  };
};
