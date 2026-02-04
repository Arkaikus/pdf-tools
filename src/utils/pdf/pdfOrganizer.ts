// PDF Organization utilities
import { PDFDocument, degrees } from 'pdf-lib';
import type { OrganizePDFOptions } from '../../types/pdf.types';

export interface PageOperation {
  pageIndex: number;
  rotation?: number; // 0, 90, 180, 270
  delete?: boolean;
}

/**
 * Organize PDF pages (reorder, rotate, delete)
 */
export const organizePDF = async (
  file: File,
  pageOperations: PageOperation[]
): Promise<Uint8Array> => {
  // Load source PDF
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  
  // Create new PDF
  const newPdf = await PDFDocument.create();

  // Process each page operation
  for (const operation of pageOperations) {
    if (operation.delete) {
      continue; // Skip deleted pages
    }

    // Copy the page
    const [copiedPage] = await newPdf.copyPages(sourcePdf, [operation.pageIndex]);
    
    // Apply rotation if specified
    if (operation.rotation && operation.rotation !== 0) {
      copiedPage.setRotation(degrees(operation.rotation));
    }

    newPdf.addPage(copiedPage);
  }

  // Save and return
  return await newPdf.save();
};

/**
 * Rotate specific pages in a PDF
 */
export const rotatePDFPages = async (
  file: File,
  rotations: Record<number, number> // pageIndex -> rotation degrees
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  const pages = pdfDoc.getPages();
  
  Object.entries(rotations).forEach(([pageIndexStr, rotation]) => {
    const pageIndex = parseInt(pageIndexStr, 10);
    if (pageIndex >= 0 && pageIndex < pages.length) {
      const page = pages[pageIndex];
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + rotation) % 360));
    }
  });

  return await pdfDoc.save();
};

/**
 * Delete specific pages from a PDF
 */
export const deletePDFPages = async (
  file: File,
  pageIndicesToDelete: number[]
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const totalPages = sourcePdf.getPageCount();
  
  // Get indices of pages to keep
  const pagesToKeep = Array.from({ length: totalPages }, (_, i) => i)
    .filter((i) => !pageIndicesToDelete.includes(i));

  // Create new PDF with only kept pages
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(sourcePdf, pagesToKeep);
  
  copiedPages.forEach((page) => {
    newPdf.addPage(page);
  });

  return await newPdf.save();
};

/**
 * Reorder PDF pages
 */
export const reorderPDFPages = async (
  file: File,
  newOrder: number[] // Array of page indices in desired order
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  
  // Create new PDF with pages in new order
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(sourcePdf, newOrder);
  
  copiedPages.forEach((page) => {
    newPdf.addPage(page);
  });

  return await newPdf.save();
};

/**
 * Extract specific pages to a new PDF
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
