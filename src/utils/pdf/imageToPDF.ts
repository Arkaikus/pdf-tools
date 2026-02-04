// Image to PDF conversion utilities
import { PDFDocument, rgb } from 'pdf-lib';
import type { ImageToPDFOptions } from '../../types/pdf.types';

// Page size presets (in points: 1 inch = 72 points)
const PAGE_SIZES = {
  A4: { width: 595, height: 842 },
  Letter: { width: 612, height: 792 },
  Legal: { width: 612, height: 1008 },
};

interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Get image dimensions from file
 */
const getImageDimensions = (file: File): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

/**
 * Calculate scaled dimensions to fit within page
 */
const calculateScaledDimensions = (
  imgWidth: number,
  imgHeight: number,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  maintainAspectRatio: boolean
): { width: number; height: number } => {
  const availableWidth = pageWidth - margin * 2;
  const availableHeight = pageHeight - margin * 2;

  if (!maintainAspectRatio) {
    return { width: availableWidth, height: availableHeight };
  }

  const widthRatio = availableWidth / imgWidth;
  const heightRatio = availableHeight / imgHeight;
  const scale = Math.min(widthRatio, heightRatio);

  return {
    width: imgWidth * scale,
    height: imgHeight * scale,
  };
};

/**
 * Convert images to PDF
 */
export const convertImagesToPDF = async (
  files: File[],
  options: ImageToPDFOptions = {}
): Promise<Uint8Array> => {
  const {
    pageSize = 'A4',
    orientation = 'portrait',
    margin = 20,
    fitToPage = true,
    maintainAspectRatio = true,
  } = options;

  // Create PDF document
  const pdfDoc = await PDFDocument.create();

  // Get page dimensions
  const pageSizes = pageSize === 'Custom' ? PAGE_SIZES.A4 : PAGE_SIZES[pageSize];
  const pageWidth = orientation === 'portrait' ? pageSizes.width : pageSizes.height;
  const pageHeight = orientation === 'portrait' ? pageSizes.height : pageSizes.width;

  // Process each image
  for (const file of files) {
    try {
      // Read image data
      const imageBytes = await file.arrayBuffer();
      const uint8Array = new Uint8Array(imageBytes);

      // Embed image based on type
      let image;
      if (file.type === 'image/png') {
        image = await pdfDoc.embedPng(uint8Array);
      } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        image = await pdfDoc.embedJpg(uint8Array);
      } else {
        // Convert to JPEG for other formats
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const url = URL.createObjectURL(file);

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });

        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const base64 = jpegDataUrl.split(',')[1];
        const jpegBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

        URL.revokeObjectURL(url);
        image = await pdfDoc.embedJpg(jpegBytes);
      }

      // Calculate dimensions
      const imgDims = image.scale(1);
      let drawWidth = imgDims.width;
      let drawHeight = imgDims.height;

      if (fitToPage) {
        const scaled = calculateScaledDimensions(
          imgDims.width,
          imgDims.height,
          pageWidth,
          pageHeight,
          margin,
          maintainAspectRatio
        );
        drawWidth = scaled.width;
        drawHeight = scaled.height;
      }

      // Add page
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Center image on page
      const x = (pageWidth - drawWidth) / 2;
      const y = (pageHeight - drawHeight) / 2;

      // Draw image
      page.drawImage(image, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });
    } catch (error) {
      console.error(`Failed to process image ${file.name}:`, error);
      throw error;
    }
  }

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
