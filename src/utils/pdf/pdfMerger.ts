// PDF Merger utilities
import { PDFDocument } from 'pdf-lib';
import type { MergePDFOptions } from '../../types/pdf.types';

/**
 * Parse page range string (e.g., "1-3,5,7-10" or "all")
 */
export const parsePageRange = (range: string, totalPages: number): number[] => {
  if (!range || range.toLowerCase() === 'all') {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const pages = new Set<number>();
  const parts = range.split(',').map((s) => s.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = Math.max(1, parseInt(startStr, 10)) - 1; // Convert to 0-based
      const end = Math.min(totalPages, parseInt(endStr, 10)) - 1;

      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          pages.add(i);
        }
      }
    } else {
      const pageNum = parseInt(part, 10) - 1; // Convert to 0-based
      if (!isNaN(pageNum) && pageNum >= 0 && pageNum < totalPages) {
        pages.add(pageNum);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
};

/**
 * Get page count from PDF file
 */
export const getPDFPageCount = async (file: File): Promise<number> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  return pdfDoc.getPageCount();
};

/**
 * Merge multiple PDFs into a single PDF
 */
export const mergePDFs = async (
  files: File[],
  options: MergePDFOptions = {}
): Promise<Uint8Array> => {
  const { pageRanges = {} } = options;

  // Create new PDF document
  const mergedPdf = await PDFDocument.create();

  // Process each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileId = `file-${i}`;
    
    try {
      // Load source PDF
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const totalPages = sourcePdf.getPageCount();

      // Determine which pages to include
      const rangeStr = pageRanges[fileId] || 'all';
      const pagesToInclude = parsePageRange(rangeStr, totalPages);

      // Copy pages
      const copiedPages = await mergedPdf.copyPages(
        sourcePdf,
        pagesToInclude
      );

      // Add copied pages to merged PDF
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    } catch (error) {
      console.error(`Failed to process file ${file.name}:`, error);
      throw new Error(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Save merged PDF
  const mergedPdfBytes = await mergedPdf.save();
  return mergedPdfBytes;
};

/**
 * Extract specific pages from a PDF
 */
export const extractPDFPages = async (
  file: File,
  pageIndices: number[]
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
  
  copiedPages.forEach((page) => {
    newPdf.addPage(page);
  });

  return await newPdf.save();
};
