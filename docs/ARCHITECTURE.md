# PDF Tools - Architecture

Technical architecture and design decisions for the PDF Tools MVP.

---

## Overview

PDF Tools is a **privacy-first, frontend-only** web application for PDF manipulation. All processing happens client-side in the browser - no files are ever uploaded to any server.

### Core Principles

1. **Privacy First** - Zero server communication, 100% client-side processing
2. **Simple Architecture** - React components + utility functions, no complex state management
3. **Modern Stack** - React 19, Bun runtime, Tailwind CSS v4
4. **Production Ready** - Docker containerization, nginx serving

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Runtime** | Bun | Fast JavaScript runtime and bundler |
| **Framework** | React 19 | UI components and reactivity |
| **Language** | TypeScript | Type safety and better DX |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework |
| **Routing** | React Router DOM v6 | Client-side routing |
| **Icons** | React Icons (FA) | Font Awesome icons |
| **PDF Creation** | pdf-lib | Create, merge, modify PDFs |
| **PDF Rendering** | pdfjs-dist | Generate thumbnails, render pages |
| **File Downloads** | file-saver | Client-side file downloads |
| **Storage** | IndexedDB (idb) | Task persistence (24h) |
| **Storage** | LocalStorage | User preferences |
| **Utilities** | clsx | CSS class management |
| **Container** | Docker + nginx | Production deployment |

---

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── Dropzone/
│   │   ├── Toast/
│   │   └── Loader/
│   └── pdf/             # PDF-specific components
│       └── FileList/
│
├── features/            # Feature modules (main tools)
│   ├── jpg-to-pdf/
│   │   ├── components/  # Feature-specific components
│   │   ├── hooks/       # Feature-specific hooks
│   │   ├── JpgToPdf.tsx # Main feature component
│   │   └── index.ts
│   ├── merge-pdf/
│   └── organize-pdf/
│
├── pages/               # Top-level page components
│   ├── Home.tsx         # Landing page
│   └── TaskQueue.tsx    # Task queue page
│
├── layouts/             # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   └── MainLayout.tsx
│
├── hooks/               # Shared React hooks
│   └── useTaskQueue.ts  # Task queue management
│
├── contexts/            # React contexts
│   └── ToastContext.tsx # Toast notifications
│
├── utils/               # Utility functions
│   ├── pdf/            # PDF manipulation
│   │   ├── imageToPDF.ts
│   │   ├── pdfMerger.ts
│   │   ├── pdfOrganizer.ts
│   │   └── pdfRenderer.ts
│   ├── storage/        # Storage helpers
│   │   ├── indexedDB.ts
│   │   └── localStorage.ts
│   └── file/           # File utilities
│       ├── fileValidator.ts
│       └── fileSaver.ts
│
├── types/               # TypeScript type definitions
│   ├── global.d.ts
│   ├── pdf.types.ts
│   └── storage.types.ts
│
├── App.tsx              # Main app component (routing)
├── index.tsx            # React entry point
├── index.ts             # Bun server configuration
└── index.css            # Global styles (Tailwind)
```

---

## Architecture Pattern

### Feature Module Pattern

Each feature (tool) is self-contained:

```
features/jpg-to-pdf/
├── JpgToPdf.tsx           # Main UI component
├── hooks/
│   └── useImageToPDF.ts   # Business logic hook
├── components/
│   └── ImageSettings.tsx  # Feature-specific component
└── index.ts               # Public exports
```

**Benefits:**
- Easy to add new features
- Clear separation of concerns
- Reusable hooks for logic
- Self-documenting structure

---

## Data Flow

### File Upload to Download

```
1. User uploads file
   ↓
2. File validation (type, size)
   ↓
3. Read file as ArrayBuffer
   ↓
4. Process with pdf-lib/pdfjs-dist
   ↓
5. Create task in IndexedDB
   ↓
6. Generate output (Uint8Array)
   ↓
7. Convert to Blob
   ↓
8. Trigger download + store in task
```

### Task Queue Flow

```
1. Tool creates task
   ↓
2. Generate unique 5-char ID
   ↓
3. Store task + result in IndexedDB
   ↓
4. Update UI (badge count)
   ↓
5. User can re-download from queue
   ↓
6. Auto-cleanup after 24 hours
```

---

## State Management

### Approach: Local State + Context

No complex state management library. Uses:
- **useState/useReducer** - Component state
- **Context API** - Toast notifications
- **Custom Hooks** - Reusable business logic
- **IndexedDB** - Persistent storage

### Custom Hooks

Each feature has a main hook:

```typescript
// hooks/useImageToPDF.ts
export const useImageToPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState<PDFSettings>({ ... });
  
  const createPDF = useCallback(async () => {
    // PDF creation logic
  }, [files, settings]);
  
  return { files, settings, createPDF, ... };
};
```

**Benefits:**
- Logic separated from UI
- Testable
- Reusable
- Type-safe

---

## Storage Strategy

### IndexedDB (Large Data)

Used for task queue persistence:

```typescript
// Database: pdf-tools-db
// Store: tasks

interface Task {
  id: string;              // 5-char random ID
  tool: string;            // 'jpg-to-pdf' | 'merge-pdf' | 'organize-pdf'
  status: string;          // 'processing' | 'completed' | 'failed'
  inputFiles: FileInfo[];  // Input file metadata
  outputFile: Blob;        // Result PDF (stored as blob)
  createdAt: number;       // Timestamp
  error?: string;          // Error message if failed
}
```

**Auto-Cleanup:**
- Tasks older than 24 hours are automatically deleted
- Runs on app startup and periodically
- Ensures privacy and frees storage

### LocalStorage (Small Data)

Used for user preferences (future):

```typescript
interface UserSettings {
  theme?: 'light' | 'dark';
  defaultPageSize?: 'A4' | 'Letter' | 'Legal';
  defaultOrientation?: 'portrait' | 'landscape';
}
```

---

## PDF Processing

### Libraries Used

#### pdf-lib (Manipulation)

Used for creating and modifying PDFs:

```typescript
import { PDFDocument } from 'pdf-lib';

// Create PDF from images
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([width, height]);
const image = await pdfDoc.embedJpg(imageBytes);
page.drawImage(image, { ... });

// Merge PDFs
const mergedPdf = await PDFDocument.create();
const pages = await mergedPdf.copyPages(sourcePdf, [0, 1, 2]);
pages.forEach(page => mergedPdf.addPage(page));

// Organize PDF
const doc = await PDFDocument.load(pdfBytes);
const [page] = await doc.copyPages(doc, [0]);
page.setRotation(degrees(90));
doc.addPage(page);
```

#### pdfjs-dist (Rendering)

Used for generating thumbnails:

```typescript
import * as pdfjsLib from 'pdfjs-dist';

// Load PDF
const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

// Render page to canvas
const page = await pdf.getPage(pageNumber);
const viewport = page.getViewport({ scale: 0.5 });
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
await page.render({ canvasContext: context, viewport }).promise;

// Convert to image
const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
```

**PDF.js Worker:**
- Local worker file copied during build: `dist/pdf.worker.min.mjs`
- Source: `node_modules/pdfjs-dist/build/pdf.worker.min.mjs`
- Setup via `bun run setup:worker` (copies to `public/`)
- Build script copies from `public/` to `dist/`
- **Smart Path Detection**: Automatically adapts to deployment context
  - Root deployment (`/`): loads from `/pdf.worker.min.mjs`
  - Subdirectory (GitHub Pages `/pdf-tools/`): loads from `/pdf-tools/pdf.worker.min.mjs`
  - Uses `window.location.pathname` for runtime detection (works with HashRouter)
- No CDN dependencies (privacy + reliability)
- Works offline after initial load

---

## Routing

### React Router DOM v6

```typescript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
    <Route path="/merge-pdf" element={<MergePdf />} />
    <Route path="/organize-pdf" element={<OrganizePdf />} />
    <Route path="/tasks" element={<TaskQueue />} />
  </Routes>
</BrowserRouter>
```

**Features:**
- Clean URLs (no hash routing)
- Nested layouts (MainLayout wrapper)
- Client-side navigation
- nginx configured for SPA routing

---

## Styling

### Tailwind CSS v4

```typescript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... full palette
          900: '#1e3a8a',
        },
      },
    },
  },
};
```

**Integration:**
- `bun-plugin-tailwind` for Bun compatibility
- PostCSS with Tailwind plugin
- `@import "tailwindcss"` in index.css
- JIT mode for fast development

**Utilities:**
- `clsx` for conditional classes
- Custom utility classes for common patterns
- Responsive design (mobile-first)

---

## Component Patterns

### Compound Components

```typescript
// Button with variants
<Button variant="primary" size="lg">
  Create PDF
</Button>

<Button variant="outline" size="sm" disabled>
  Processing...
</Button>
```

### Portal Rendering

```typescript
// Modal uses React portal
createPortal(
  <div className="modal-backdrop">
    <div className="modal-content">
      {children}
    </div>
  </div>,
  document.body
);
```

### Controlled Components

```typescript
// File upload with controlled state
<Dropzone
  files={files}
  onFilesChange={setFiles}
  accept=".pdf"
  maxSize={100 * 1024 * 1024} // 100MB
/>
```

---

## Build & Deployment

### Development

```bash
bun dev  # Port 3333
```

- Hot module replacement
- Fast refresh
- Console logs from browser
- Source maps

### Production Build

```bash
bun run build
```

**Process:**
1. Setup PDF.js worker
2. Bundle with Bun
3. Minify code
4. Generate source maps
5. Copy public assets to dist/

**Output:**
- `dist/index.html` - Entry point
- `dist/*.js` - Bundled JavaScript
- `dist/pdf.worker.min.mjs` - PDF.js worker

### Docker Deployment

**Multi-stage Dockerfile:**

```dockerfile
# Stage 1: Build
FROM oven/bun:1.1-alpine AS builder
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build
RUN mkdir -p dist && cp -r public/* dist/

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx Configuration:**
- Gzip compression
- Caching headers
- SPA fallback (`try_files $uri /index.html`)
- Security headers

---

## Performance Considerations

### Current Implementation

- **No Web Workers** - Processing happens on main thread (acceptable for MVP)
- **No Virtual Scrolling** - Standard rendering (fine for <100 pages)
- **No Code Splitting** - Single bundle (small enough at ~500KB)
- **No Lazy Loading** - All components loaded upfront

### Future Optimizations (Phase 5)

If needed for larger PDFs:
- Web Workers for heavy processing
- Virtual scrolling for page grids
- Progressive loading of thumbnails
- Memory management for 100MB+ files

---

## Security & Privacy

### Client-Side Only

- **Zero Network Requests** (except initial load)
- No file uploads to servers
- No tracking or analytics
- All processing in browser

### Data Retention

- **Tasks**: 24 hours (auto-deleted)
- **Files**: Not persisted (only task results)
- **Settings**: Persist indefinitely (user preference)

### Content Security

- **Input Validation**: File type, size checks
- **Error Handling**: Graceful failure, no data leaks
- **Blob Cleanup**: URLs revoked after use
- **IndexedDB**: Limited to app origin

---

## Browser Compatibility

### Supported Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |

### Required APIs

- ES2020+ features
- IndexedDB
- Web Workers (for PDF.js)
- Blob/File APIs
- Canvas 2D API
- Drag & Drop API

---

## Testing Strategy

### Current State (MVP)

- Manual testing only
- Browser console for debugging
- No automated tests

### Future (Phase 6)

- Unit tests for utilities (pdf-lib operations)
- Integration tests for features
- E2E tests for critical flows
- Cross-browser testing

---

## Error Handling

### Approach

```typescript
try {
  const pdf = await createPDF(files, settings);
  await downloadFile(pdf, 'output.pdf');
  showToast({ type: 'success', message: 'PDF created!' });
} catch (error) {
  console.error('PDF creation failed:', error);
  showToast({ 
    type: 'error', 
    message: 'Failed to create PDF. Please try again.' 
  });
}
```

### User-Facing Errors

- Toast notifications for all errors
- Clear, non-technical messages
- Actionable suggestions when possible
- Error logged to console for debugging

---

## Development Workflow

### Adding a New Feature

1. Create feature directory in `src/features/`
2. Implement main component
3. Create custom hook for logic
4. Add utility functions to `src/utils/`
5. Add route in `App.tsx`
6. Add tool card on homepage
7. Integrate with task queue
8. Test manually
9. Update documentation

### File Organization Rules

- **Components**: Organized by type (common, pdf, feature-specific)
- **Utilities**: Organized by domain (pdf, file, storage)
- **Types**: Separate files for each domain
- **Exports**: Always use index.ts barrel files

---

## Key Design Decisions

### Why Bun?

- Faster than Node.js/npm
- Built-in bundler (no Webpack/Vite needed)
- Great TypeScript support
- Hot reload out of the box

### Why No State Management Library?

- MVP doesn't need it
- Component state + hooks sufficient
- Simpler architecture
- Easier to understand and maintain

### Why IndexedDB for Tasks?

- Can store large Blobs (PDF files)
- Async API (non-blocking)
- Good browser support
- Built-in expiration via cleanup

### Why Client-Side Only?

- **Privacy**: No server = no data collection
- **Cost**: No server infrastructure needed
- **Simplicity**: Single deployment artifact
- **Performance**: No network latency

---

## Limitations & Trade-offs

### Current Limitations

1. **File Size**: ~100MB max (browser memory limits)
2. **Processing Speed**: Main thread blocking for large files
3. **Browser Only**: Requires modern browser, no mobile app
4. **No Collaboration**: Single-user, no sharing/cloud sync

### Acceptable Trade-offs

- **No server** = Can't handle very large files efficiently
- **Client-side** = Can't use server-side PDF libraries
- **IndexedDB** = 24h retention limit for privacy
- **No tests** = Manual QA for MVP (tests come in Phase 6)

---

## Future Architecture Improvements

### Phase 4-5 Enhancements

- Web Workers for processing
- Virtual scrolling for large PDFs
- Progressive thumbnail loading
- PWA support (offline mode)
- Batch operations
- Keyboard shortcuts

### Phase 6 Considerations

- Unit test coverage
- Integration tests
- Performance benchmarks
- Accessibility audit
- Security audit

---

## Documentation

For more details, see:

- **[USER_GUIDE.md](USER_GUIDE.md)** - How to use features
- **[INSTALL.md](INSTALL.md)** - Setup instructions
- **[TODO.md](TODO.md)** - Roadmap and progress
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues

---

**Last Updated:** February 4, 2026  
**Version:** 1.0.0 (MVP Complete)  
**Status:** Production Ready ✅
