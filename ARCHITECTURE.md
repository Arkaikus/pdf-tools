# PDF Tools - Architecture Documentation

## Overview

PDF Tools is a frontend-only web application for PDF manipulation. All processing happens client-side using Web APIs and JavaScript libraries, ensuring complete privacy.

## Architecture Principles

### 1. Privacy First
- **Zero Server Communication**: No files uploaded to any server
- **Client-Side Only**: All processing in the browser
- **Temporary Storage**: Auto-cleanup after 24 hours
- **No Tracking**: No analytics without explicit consent

### 2. Performance
- **Web Workers**: Heavy processing off main thread
- **Lazy Loading**: Load only what's needed
- **Memory Management**: Aggressive cleanup of large objects
- **Progressive Loading**: Chunked processing for large files

### 3. User Experience
- **Instant Feedback**: < 100ms UI response
- **Progress Indicators**: Clear status for long operations
- **Error Recovery**: Graceful failure handling
- **Offline First**: Works without internet

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │              React Application Layer               │ │
│  │                                                    │ │
│  │  ┌──────────────┐  ┌──────────────┐             │ │
│  │  │   Features   │  │  Components  │             │ │
│  │  │              │  │              │             │ │
│  │  │ - JPG to PDF │  │ - FileUpload │             │ │
│  │  │ - Merge PDF  │  │ - PDFViewer  │             │ │
│  │  │ - Organize   │  │ - PageGrid   │             │ │
│  │  └──────┬───────┘  └──────┬───────┘             │ │
│  │         │                  │                      │ │
│  │         └──────────┬───────┘                      │ │
│  │                    │                              │ │
│  │         ┌──────────▼───────────┐                 │ │
│  │         │   Hooks & State Mgmt │                 │ │
│  │         └──────────┬───────────┘                 │ │
│  └────────────────────┼──────────────────────────────┘ │
│                       │                                 │
│  ┌────────────────────▼──────────────────────────────┐ │
│  │              Business Logic Layer                 │ │
│  │                                                    │ │
│  │  ┌──────────────┐  ┌──────────────┐             │ │
│  │  │  PDF Utils   │  │  File Utils  │             │ │
│  │  │              │  │              │             │ │
│  │  │ - Create     │  │ - Validate   │             │ │
│  │  │ - Merge      │  │ - Convert    │             │ │
│  │  │ - Organize   │  │ - Optimize   │             │ │
│  │  └──────┬───────┘  └──────┬───────┘             │ │
│  └─────────┼──────────────────┼─────────────────────┘ │
│            │                  │                        │
│  ┌─────────▼──────────────────▼─────────────────────┐ │
│  │           Library & API Layer                    │ │
│  │                                                   │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │ │
│  │  │ pdf-lib  │  │ pdfjs    │  │ Workers  │      │ │
│  │  └──────────┘  └──────────┘  └──────────┘      │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │              Storage Layer                        │ │
│  │                                                   │ │
│  │  ┌──────────────┐        ┌──────────────┐       │ │
│  │  │  IndexedDB   │        │ LocalStorage │       │ │
│  │  │  (Files)     │        │ (Settings)   │       │ │
│  │  └──────────────┘        └──────────────┘       │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Component Architecture

### Feature Module Pattern

Each feature is self-contained with its own components, hooks, and utilities:

```
features/
└── jpg-to-pdf/
    ├── index.ts                 # Public API
    ├── JpgToPdf.tsx            # Main component
    ├── components/             # Feature-specific components
    │   ├── ImageUploader.tsx
    │   ├── ImagePreview.tsx
    │   └── ImageSettings.tsx
    ├── hooks/                  # Feature-specific hooks
    │   ├── useImageToPDF.ts
    │   └── useImageOptimizer.ts
    ├── utils/                  # Feature-specific utilities
    │   └── imageConverter.ts
    └── types.ts                # Feature-specific types
```

### Shared Components

```
components/
├── common/                     # Generic UI components
│   ├── Button/
│   ├── Modal/
│   ├── Dropzone/
│   └── Toast/
└── pdf/                        # PDF-specific components
    ├── PDFViewer/
    ├── PageThumbnail/
    └── PageGrid/
```

## Data Flow

### 1. File Upload Flow

```
User drops file
    ↓
FileUpload Component
    ↓
Validate file (type, size)
    ↓
Convert to ArrayBuffer
    ↓
Store in IndexedDB (optional)
    ↓
Pass to Feature Component
    ↓
Process with pdf-lib/worker
    ↓
Display result
```

### 2. PDF Processing Flow

```
Input PDF(s)
    ↓
Load PDF with pdf-lib
    ↓
Extract pages/content
    ↓
Apply transformations
    ↓
Generate new PDF
    ↓
Create download blob
    ↓
Trigger download
```

### 3. State Management

```typescript
// Feature state
interface PDFToolState {
  files: File[];
  processing: boolean;
  progress: number;
  error: Error | null;
  result: Uint8Array | null;
}

// App state (context)
interface AppState {
  theme: 'light' | 'dark';
  settings: UserSettings;
  recentTools: string[];
}
```

## Storage Strategy

### IndexedDB (Large Data)

Used for temporary file storage:

```typescript
interface FileStore {
  id: string;
  name: string;
  size: number;
  type: string;
  data: ArrayBuffer;
  createdAt: Date;
  expiresAt: Date;
}

// Auto-cleanup after 24 hours
```

### LocalStorage (Small Data)

Used for user preferences:

```typescript
interface Settings {
  theme: 'light' | 'dark';
  defaultQuality: 'low' | 'medium' | 'high';
  autoDownload: boolean;
  recentTools: string[];
}
```

## Performance Optimization

### 1. Web Workers

Heavy PDF processing runs in workers to keep UI responsive:

```typescript
// pdf.worker.ts
self.addEventListener('message', async (e) => {
  const { type, data } = e.data;
  
  switch (type) {
    case 'MERGE_PDF':
      const result = await mergePDFs(data.files);
      self.postMessage({ type: 'MERGE_COMPLETE', result });
      break;
  }
});
```

### 2. Lazy Loading

```typescript
// Load PDF.js only when needed
const loadPDFJS = async () => {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
  return pdfjs;
};
```

### 3. Virtual Scrolling

For large PDF page lists:

```typescript
// Only render visible pages
const PageGrid = ({ pages }) => {
  const visiblePages = useVirtualScroll(pages, {
    itemHeight: 200,
    overscan: 5
  });
  
  return visiblePages.map(page => <PageThumbnail {...page} />);
};
```

### 4. Memory Management

```typescript
// Cleanup after processing
const processPDF = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer);
  
  // Process...
  
  // Cleanup
  pdf.destroy?.();
  buffer = null; // Help GC
};
```

## Security Considerations

### 1. Input Validation

```typescript
const validateFile = (file: File): ValidationResult => {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }
  
  // Check file size (max 100MB)
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large' };
  }
  
  return { valid: true };
};
```

### 2. Content Security Policy

```nginx
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';  # for PDF.js
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  worker-src 'self' blob:;
```

### 3. Memory Limits

```typescript
// Prevent memory exhaustion
const MAX_PAGES = 500;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

if (pdf.getPageCount() > MAX_PAGES) {
  throw new Error('PDF has too many pages');
}
```

## Error Handling

### Error Types

```typescript
enum PDFErrorType {
  INVALID_FILE = 'INVALID_FILE',
  CORRUPTED_PDF = 'CORRUPTED_PDF',
  MEMORY_ERROR = 'MEMORY_ERROR',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

class PDFError extends Error {
  constructor(
    public type: PDFErrorType,
    message: string,
    public userMessage: string
  ) {
    super(message);
  }
}
```

### Error Recovery

```typescript
const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(1000 * Math.pow(2, i)); // Exponential backoff
    }
  }
};
```

## Testing Strategy

### Unit Tests

```typescript
// Test pure functions
describe('mergePDFs', () => {
  it('should merge two PDFs', async () => {
    const pdf1 = await loadTestPDF('test1.pdf');
    const pdf2 = await loadTestPDF('test2.pdf');
    
    const result = await mergePDFs([pdf1, pdf2]);
    
    expect(result.getPageCount()).toBe(5);
  });
});
```

### Integration Tests

```typescript
// Test feature workflows
describe('JPG to PDF Feature', () => {
  it('should convert images to PDF', async () => {
    const { container } = render(<JpgToPdf />);
    
    const files = [createTestImage('test1.jpg')];
    await uploadFiles(container, files);
    
    await clickConvertButton(container);
    
    expect(getDownloadedFile()).toBeDefined();
  });
});
```

### E2E Tests

```typescript
// Test complete user flows
test('User can merge two PDFs', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Merge PDF');
  
  await page.setInputFiles('input[type=file]', [
    'test1.pdf',
    'test2.pdf'
  ]);
  
  await page.click('text=Merge');
  
  const download = await page.waitForEvent('download');
  expect(download.suggestedFilename()).toContain('.pdf');
});
```

## Deployment Architecture

### Docker Container

```
┌─────────────────────────────────┐
│      Docker Container           │
│                                  │
│  ┌────────────────────────────┐ │
│  │     Nginx (Port 80)        │ │
│  │                            │ │
│  │  - Serve static files      │ │
│  │  - Gzip compression        │ │
│  │  - Security headers        │ │
│  │  - SPA routing             │ │
│  └────────────────────────────┘ │
│                                  │
│  ┌────────────────────────────┐ │
│  │    Static Files            │ │
│  │                            │ │
│  │  - index.html              │ │
│  │  - bundle.js               │ │
│  │  - styles.css              │ │
│  │  - pdf.worker.js           │ │
│  └────────────────────────────┘ │
└─────────────────────────────────┘
```

### Build Process

```
Source Code (TypeScript/React)
    ↓
Bun build (bundling, minification)
    ↓
Static Assets (HTML, JS, CSS)
    ↓
Docker Image (with Nginx)
    ↓
Container Registry
    ↓
Production Deployment
```

## Monitoring & Observability

### Client-Side Logging

```typescript
interface LogEvent {
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
  timestamp: Date;
}

// Store logs in IndexedDB for debugging
logger.error('PDF processing failed', {
  fileName: file.name,
  fileSize: file.size,
  error: error.message
});
```

### Performance Metrics

```typescript
// Measure key operations
const measurePerformance = (operation: string) => {
  const start = performance.now();
  
  return () => {
    const duration = performance.now() - start;
    
    // Log metric
    metrics.record(operation, duration);
  };
};
```

## Future Enhancements

### 1. PWA Support
- Service Worker for offline functionality
- App manifest for install prompt
- Background sync for large operations

### 2. Advanced Features
- OCR for scanned PDFs
- PDF form filling
- Digital signatures
- Password protection

### 3. Performance
- WASM for critical operations
- Shared Web Workers
- Better caching strategies

---

This architecture is designed to be:
- **Scalable**: Easy to add new features
- **Maintainable**: Clear separation of concerns
- **Performant**: Optimized for client-side processing
- **Secure**: Privacy-first, no data leakage
