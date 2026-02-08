import { useState, useCallback, useEffect } from 'react';
import { organizePDF, generateAllThumbnails } from '../../../utils/pdf';
import { downloadFile, generateFilename, validatePDFFile } from '../../../utils/file';
import { useTaskQueue } from '../../../hooks/useTaskQueue';
import { usePipeline } from '../../../contexts/PipelineContext';
import { useToast } from '../../../contexts/ToastContext';
import { pipedFilesToFiles } from '../../../utils/pipeline';
import type { PageOperation } from '../../../utils/pdf/pdfOrganizer';

export interface PDFPageData {
  index: number; // 0-indexed
  thumbnail: string;
  rotation: number; // 0, 90, 180, 270
  isDeleted: boolean;
}

interface UseOrganizePDFResult {
  file: File | null;
  pages: PDFPageData[];
  isLoading: boolean;
  isProcessing: boolean;
  progress: number;
  error: string | null;
  loadPDF: (file: File) => Promise<void>;
  rotatePage: (index: number, degrees: number) => void;
  deletePage: (index: number) => void;
  restorePage: (index: number) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  savePDF: () => Promise<void>;
  reset: () => void;
}

export const useOrganizePDF = (): UseOrganizePDFResult => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { createNewTask, completeTask, failTask } = useTaskQueue();
  const { pipedFiles, sourceTaskId, clearPipedFiles } = usePipeline();
  const { addToast } = useToast();

  // Handle piped files from task queue
  useEffect(() => {
    if (pipedFiles.length > 0) {
      const loadPipedFile = async () => {
        try {
          const fileObjects = pipedFilesToFiles(pipedFiles);
          
          // Organize PDF only accepts a single file
          if (fileObjects.length > 0) {
            await loadPDF(fileObjects[0]);
            
            addToast('success', `Loaded PDF from task ${sourceTaskId}`);
          }
          
          clearPipedFiles();
        } catch (err) {
          console.error('Failed to load piped file:', err);
          addToast('error', 'Failed to load piped file');
        }
      };

      loadPipedFile();
    }
  }, [pipedFiles, sourceTaskId, clearPipedFiles, addToast]);

  const loadPDF = useCallback(async (pdfFile: File) => {
    const validation = validatePDFFile(pdfFile);
    if (!validation.valid) {
      setError(validation.error || 'Invalid PDF file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Generate thumbnails
      const thumbnails = await generateAllThumbnails(
        pdfFile,
        0.3, // scale
        (current, total) => {
          setProgress(Math.round((current / total) * 100));
        }
      );

      // Create page data
      const pageData: PDFPageData[] = thumbnails.map((thumbnail, index) => ({
        index,
        thumbnail,
        rotation: 0,
        isDeleted: false,
      }));

      setFile(pdfFile);
      setPages(pageData);
      setProgress(100);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const rotatePage = useCallback((index: number, degrees: number) => {
    setPages((prev) =>
      prev.map((page) =>
        page.index === index
          ? { ...page, rotation: (page.rotation + degrees) % 360 }
          : page
      )
    );
  }, []);

  const deletePage = useCallback((index: number) => {
    setPages((prev) =>
      prev.map((page) =>
        page.index === index ? { ...page, isDeleted: true } : page
      )
    );
  }, []);

  const restorePage = useCallback((index: number) => {
    setPages((prev) =>
      prev.map((page) =>
        page.index === index ? { ...page, isDeleted: false } : page
      )
    );
  }, []);

  const reorderPages = useCallback((fromIndex: number, toIndex: number) => {
    setPages((prev) => {
      const newPages = [...prev];
      const [movedPage] = newPages.splice(fromIndex, 1);
      newPages.splice(toIndex, 0, movedPage);
      return newPages;
    });
  }, []);

  const savePDF = useCallback(async () => {
    if (!file || pages.length === 0) {
      setError('No PDF loaded');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    let taskId: string | null = null;

    try {
      // Create task with pipeline metadata if available
      taskId = await createNewTask(
        'organize-pdf',
        [{ name: file.name, size: file.size }],
        sourceTaskId ? { sourceTaskId } : undefined
      );

      // Build page operations
      const operations: PageOperation[] = pages.map((page) => ({
        pageIndex: page.index,
        rotation: page.rotation,
        delete: page.isDeleted,
      }));

      // Organize PDF
      setProgress(50);
      const organizedPdfBytes = await organizePDF(file, operations);

      // Create filename and blob
      setProgress(80);
      const filename = generateFilename('organized', 'pdf');
      const blob = new Blob([organizedPdfBytes], { type: 'application/pdf' });

      // Complete task
      await completeTask(taskId, {
        name: filename,
        size: blob.size,
        data: blob,
      });

      // Download PDF
      downloadFile(organizedPdfBytes, filename);

      setProgress(100);

      // Reset after successful save
      setTimeout(() => {
        reset();
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to organize PDF';
      setError(errorMessage);

      // Fail task
      if (taskId) {
        await failTask(taskId, errorMessage);
      }

      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  }, [file, pages, createNewTask, completeTask, failTask]);

  const reset = useCallback(() => {
    setFile(null);
    setPages([]);
    setProgress(0);
    setError(null);
  }, []);

  return {
    file,
    pages,
    isLoading,
    isProcessing,
    progress,
    error,
    loadPDF,
    rotatePage,
    deletePage,
    restorePage,
    reorderPages,
    savePDF,
    reset,
  };
};
