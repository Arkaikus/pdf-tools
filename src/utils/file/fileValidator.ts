// File validation utilities

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const ALLOWED_PDF_TYPES = ['application/pdf'];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate image file
 */
export const validateImageFile = (file: File): ValidationResult => {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  return { valid: true };
};

/**
 * Validate PDF file
 */
export const validatePDFFile = (file: File): ValidationResult => {
  // Check file type
  if (!ALLOWED_PDF_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only PDF files are allowed.',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  return { valid: true };
};

/**
 * Validate multiple files
 */
export const validateFiles = (
  files: File[],
  validator: (file: File) => ValidationResult
): { valid: File[]; invalid: { file: File; error: string }[] } => {
  const valid: File[] = [];
  const invalid: { file: File; error: string }[] = [];

  files.forEach((file) => {
    const result = validator(file);
    if (result.valid) {
      valid.push(file);
    } else {
      invalid.push({ file, error: result.error || 'Invalid file' });
    }
  });

  return { valid, invalid };
};
