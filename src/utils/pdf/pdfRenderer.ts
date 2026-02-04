// PDF rendering utilities using PDF.js
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path to local file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

/**
 * Generate thumbnail for a PDF page
 */
export const generatePageThumbnail = async (
  file: File,
  pageNumber: number, // 1-indexed
  scale: number = 0.5
): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Failed to get canvas context');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render page
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    // Convert to data URL
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch (error) {
    console.error('Failed to generate thumbnail:', error);
    throw error;
  }
};

/**
 * Generate thumbnails for all pages
 */
export const generateAllThumbnails = async (
  file: File,
  scale: number = 0.5,
  onProgress?: (current: number, total: number) => void
): Promise<string[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    const totalPages = pdf.numPages;
    const thumbnails: string[] = [];

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Failed to get canvas context');
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      thumbnails.push(canvas.toDataURL('image/jpeg', 0.8));
      
      if (onProgress) {
        onProgress(i, totalPages);
      }
    }

    return thumbnails;
  } catch (error) {
    console.error('Failed to generate thumbnails:', error);
    throw error;
  }
};

/**
 * Get PDF page count
 */
export const getPDFPageCountFromFile = async (file: File): Promise<number> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    return pdf.numPages;
  } catch (error) {
    console.error('Failed to get page count:', error);
    throw error;
  }
};
