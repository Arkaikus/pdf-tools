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

## Phase 3.5 Architecture Additions

### PWA Architecture

#### Service Worker Strategy

```typescript
// Service Worker Lifecycle
src/
└── utils/
    └── sw/
        ├── registerSW.ts      // Registration & update logic
        ├── swConfig.ts        // Cache names & strategies
        └── index.ts

public/
└── sw.js                      // Service worker implementation
```

**Cache Strategies:**

| Resource Type | Strategy | TTL | Purpose |
|---------------|----------|-----|---------|
| App Shell | Cache First | ∞ | HTML, CSS, JS bundles |
| PDF.js Worker | Cache First | ∞ | PDF processing |
| Generated PDFs | Network First | 24h | Task results |
| Images/Icons | Cache First | 7d | UI assets |
| API (future) | Network Only | - | External services |

**Cache Structure:**
```typescript
{
  'pdf-tools-v1-static': ['/', '/index.css', '/main.js'],
  'pdf-tools-v1-runtime': ['/pdf.worker.min.mjs'],
  'pdf-tools-v1-dynamic': ['generated-pdfs...']
}
```

#### Offline Behavior

```
Online:
  - Full functionality
  - Cache updates in background

Offline:
  - Read-only mode
  - View cached tasks
  - Access previously generated PDFs
  - Upload disabled (show message)
  - Processing disabled (show message)
```

#### PWA Manifest

```json
{
  "name": "PDF Tools",
  "short_name": "PDF Tools",
  "display": "standalone",
  "start_url": "/",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable.png", "sizes": "512x512", "purpose": "maskable" }
  ]
}
```

---

### Pipeline Architecture

#### Data Flow for Task Piping

```
Task Queue (Source)
  ↓
  User selects "Use in [Tool]"
  ↓
  SessionStorage ← { taskId, files[], targetTool }
  ↓
  Navigate to target tool
  ↓
  Tool reads SessionStorage
  ↓
  Files pre-loaded in tool
  ↓
  SessionStorage cleared
  ↓
  New task created (linked to source)
```

#### Pipeline Context

```typescript
// contexts/PipelineContext.tsx
interface PipelineContextValue {
  pipedFiles: PipedFile[];
  sourceTask?: Task;
  pipeFiles: (taskId: string, tool: string) => Promise<void>;
  clearPipedFiles: () => void;
  isPiping: boolean;
}

// SessionStorage Schema
interface PipelineSession {
  sourceTaskId: string;
  targetTool: string;
  files: {
    name: string;
    blobUrl: string;  // Object URL (temporary)
    type: string;
    size: number;
  }[];
  timestamp: number;
}
```

#### Integration Points

```typescript
// TaskQueue.tsx - Action Menu
<TaskActionMenu task={task}>
  <MenuItem onClick={() => pipeToMerge(task)}>
    🔀 Use in Merge PDF
  </MenuItem>
  <MenuItem onClick={() => pipeToOrganize(task)}>
    📑 Use in Organize PDF
  </MenuItem>
</TaskActionMenu>

// MergePdf.tsx - Accept Piped Files
const { pipedFiles, clearPipedFiles } = usePipeline();

useEffect(() => {
  if (pipedFiles.length > 0) {
    // Convert PipedFile[] to File[]
    const files = await convertPipedFiles(pipedFiles);
    setInputFiles(prev => [...prev, ...files]);
    clearPipedFiles();
    
    showToast({
      type: 'info',
      message: `Added ${files.length} file(s) from task queue`
    });
  }
}, [pipedFiles]);
```

#### Pipeline History Tracking

```typescript
// Extended Task interface
interface Task {
  // ... existing fields
  pipelineMetadata?: {
    sourceTaskId?: string;      // Parent task (if piped from)
    pipedToTasks?: string[];    // Child tasks (if piped to)
    pipeHistory?: string[];     // Full chain: [taskA, taskB, taskC]
  };
}

// Visual representation in UI
Task A (Merge) → Task B (Organize) → Task C (Split)
```

---

### Vault & Encryption Architecture

#### Crypto Layer

```typescript
src/
└── utils/
    └── crypto/
        ├── encryption.ts       // AES-GCM operations
        ├── keyDerivation.ts    // PBKDF2 key generation
        ├── vaultService.ts     // High-level vault API
        ├── sessionManager.ts   // Auth session handling
        └── index.ts
```

#### Encryption Flow

```
User enters PIN
  ↓
PBKDF2 (100k iterations) + Salt
  ↓
AES-256-GCM Key (in memory only)
  ↓
Encrypt file data
  ↓
Store { encryptedData, iv, metadata }
  ↓
Clear key from memory on lock
```

**Key Derivation:**
```typescript
// Password → Encryption Key
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}
```

#### Vault Storage Schema

```typescript
// IndexedDB: pdf-tools-db
// New Store: vault

interface VaultConfig {
  id: 'config';
  salt: Uint8Array;            // Random salt for PBKDF2
  hashedPassword: string;      // For verification (SHA-256)
  iterations: number;          // PBKDF2 iterations (100k+)
  lockTimeout: number;         // Auto-lock timeout (ms)
  createdAt: number;
  updatedAt: number;
}

interface VaultItem {
  id: string;                  // Unique ID
  type: 'file' | 'setting';    // Item type
  encryptedData: ArrayBuffer;  // AES-GCM encrypted
  iv: Uint8Array;              // Initialization vector (12 bytes)
  metadata: {                  // NOT encrypted (for display)
    name: string;
    size: number;
    createdAt: number;
    icon?: string;
  };
}
```

#### Session Management

```typescript
// In-memory session (NOT persisted)
interface VaultSession {
  token: string;               // Random UUID
  key: CryptoKey;              // AES key (in memory)
  unlockedAt: number;
  expiresAt: number;
  isLocked: boolean;
}

// Auto-lock triggers
- Timeout reached (default: 24h)
- Tab/window close (beforeunload)
- Manual lock button
- 3 failed decryption attempts
```

#### Vault Context API

```typescript
// contexts/VaultContext.tsx
interface VaultContextValue {
  // State
  isInitialized: boolean;
  isLocked: boolean;
  session?: VaultSession;
  
  // Setup
  createVault: (password: string) => Promise<void>;
  resetVault: () => Promise<void>;
  
  // Auth
  unlock: (password: string) => Promise<boolean>;
  lock: () => void;
  changePassword: (oldPass: string, newPass: string) => Promise<void>;
  
  // Operations
  saveToVault: (item: VaultItem) => Promise<void>;
  getFromVault: (id: string) => Promise<ArrayBuffer | null>;
  deleteFromVault: (id: string) => Promise<void>;
  listVaultItems: () => Promise<VaultItem[]>;
  
  // Settings
  setLockTimeout: (ms: number) => Promise<void>;
}
```

#### Task Queue Integration

```typescript
// Extended Task interface
interface Task {
  // ... existing fields
  isVaultProtected?: boolean;   // Flag for vault tasks
  vaultItemId?: string;         // Link to VaultItem
}

// UI behavior
- Regular tasks: 24h auto-cleanup
- Vault tasks: persist indefinitely (no auto-cleanup)
- Vault tasks hidden when locked
- Download requires unlock
- Separate "Vault Tasks" section in UI
```

#### Security Considerations

**What is encrypted:**
- ✅ Task result files (PDFs, images)
- ✅ API keys (future LLM integration)
- ✅ Sensitive user settings

**What is NOT encrypted:**
- ❌ Task metadata (name, size, date)
- ❌ App settings (theme, preferences)
- ❌ Regular task queue (non-vault)

**Security guarantees:**
- No plaintext passwords stored
- Encryption key never persisted (memory only)
- Salt is unique per vault
- IV is unique per encryption
- Auto-lock prevents unauthorized access
- 3-strike lockout prevents brute force

**Limitations:**
- Memory-resident keys can be extracted via dev tools
- XSS vulnerabilities could expose keys
- Users responsible for password strength
- Forgotten password = permanent data loss

---

### Settings Architecture

#### Settings Storage

```typescript
// LocalStorage: user-settings
interface UserSettings {
  // General
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'es' | 'fr' | '...';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  
  // PDF Defaults
  defaultPageSize: 'A4' | 'Letter' | 'Legal';
  defaultOrientation: 'portrait' | 'landscape';
  defaultMargins: { top: number; right: number; bottom: number; left: number };
  
  // Task Queue
  taskCleanupTime: number;      // 24h, 48h, 7d, never
  maxTasksToKeep: number;       // 10, 25, 50, unlimited
  showCompletedTasks: boolean;
  
  // Vault
  vaultEnabled: boolean;
  vaultLockTimeout: number;     // 15min, 1h, 6h, 24h
  vaultAutoLock: boolean;
  
  // Privacy
  analyticsEnabled: boolean;    // Future
  crashReportsEnabled: boolean; // Future
}
```

#### Settings Page Structure

```typescript
src/pages/Settings.tsx

<SettingsPage>
  <SettingsSection title="General">
    <ThemeSelector />
    <LanguageSelector />
    <DateFormatSelector />
  </SettingsSection>
  
  <SettingsSection title="PDF Defaults">
    <PageSizeSelector />
    <OrientationSelector />
    <MarginControls />
  </SettingsSection>
  
  <SettingsSection title="Task Queue">
    <CleanupTimeSelector />
    <MaxTasksSelector />
    <ClearAllTasksButton />
  </SettingsSection>
  
  <SettingsSection title="Vault & Security">
    <VaultToggle />
    <ChangePINButton />
    <LockTimeoutSelector />
    <ResetVaultButton />
  </SettingsSection>
  
  <SettingsSection title="Privacy">
    <ClearCacheButton />
    <StorageUsageDisplay />
    <ExportDataButton />
    <ImportDataButton />
  </SettingsSection>
  
  <SettingsSection title="About">
    <AppVersion />
    <GitHubLink />
    <LicenseInfo />
    <PrivacyPolicy />
  </SettingsSection>
</SettingsPage>
```

---

## Updated Project Structure (Phase 3.5)

```
src/
├── components/
│   ├── common/          # Existing common components
│   ├── pdf/             # Existing PDF components
│   └── vault/           # NEW: Vault UI components
│       ├── VaultSetup.tsx
│       ├── VaultLogin.tsx
│       ├── VaultIndicator.tsx
│       ├── VaultSettings.tsx
│       └── index.ts
│
├── contexts/
│   ├── ToastContext.tsx        # Existing
│   ├── PipelineContext.tsx     # NEW: Task piping
│   └── VaultContext.tsx        # NEW: Vault state
│
├── hooks/
│   ├── useTaskQueue.ts         # Existing
│   ├── usePipeline.ts          # NEW: Pipeline operations
│   ├── useVault.ts             # NEW: Vault operations
│   ├── useVaultSession.ts      # NEW: Session management
│   └── useOnlineStatus.ts      # NEW: PWA offline detection
│
├── pages/
│   ├── Home.tsx                # Existing
│   ├── TaskQueue.tsx           # Existing (enhanced)
│   └── Settings.tsx            # NEW: Settings page
│
├── utils/
│   ├── crypto/                 # NEW: Encryption utilities
│   │   ├── encryption.ts
│   │   ├── keyDerivation.ts
│   │   ├── vaultService.ts
│   │   ├── sessionManager.ts
│   │   └── index.ts
│   ├── sw/                     # NEW: Service worker utils
│   │   ├── registerSW.ts
│   │   ├── swConfig.ts
│   │   └── index.ts
│   ├── pipeline/               # NEW: Task piping utils
│   │   ├── pipelineManager.ts
│   │   └── index.ts
│   └── storage/
│       ├── indexedDB.ts        # Enhanced for vault
│       └── localStorage.ts     # Enhanced for settings
│
└── types/
    ├── vault.types.ts          # NEW: Vault types
    ├── pipeline.types.ts       # NEW: Pipeline types
    └── settings.types.ts       # NEW: Settings types

public/
├── manifest.json               # NEW: PWA manifest
├── sw.js                       # NEW: Service worker
├── icon-192.png                # NEW: PWA icon
├── icon-512.png                # NEW: PWA icon
└── icon-maskable.png           # NEW: Maskable icon
```

---

## Updated Data Flow Diagrams

### Task Queue Pipeline Flow

```
┌─────────────┐
│ Task Queue  │
│  (Source)   │
└──────┬──────┘
       │ User clicks "Use in Tool"
       ↓
┌──────────────┐
│ Pipeline     │
│ Context      │ → SessionStorage
└──────┬───────┘
       │ Navigate to tool
       ↓
┌──────────────┐
│ Target Tool  │
│ (MergePdf)   │ ← Read SessionStorage
└──────┬───────┘
       │ Files pre-loaded
       ↓
┌──────────────┐
│ Process &    │
│ Create Task  │ → Link to source task
└──────────────┘
```

### Vault Encryption Flow

```
┌─────────────┐
│ User enters │
│  Password   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   PBKDF2    │ (100k iterations)
│  + Salt     │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  AES-256    │ (key in memory)
│    Key      │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Encrypt    │ (file data)
│   Data      │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  IndexedDB  │ { encrypted, iv, metadata }
│   Vault     │
└─────────────┘
```

### PWA Offline Flow

```
┌─────────────┐
│   Online    │
└──────┬──────┘
       │
       ↓
┌─────────────┐     Yes      ┌─────────────┐
│  In Cache?  │──────────────→│ Return from │
└──────┬──────┘               │   Cache     │
       │ No                   └─────────────┘
       ↓
┌─────────────┐
│   Fetch     │
│  Network    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Update      │
│ Cache       │
└─────────────┘

┌─────────────┐
│  Offline    │
└──────┬──────┘
       │
       ↓
┌─────────────┐     Yes      ┌─────────────┐
│  In Cache?  │──────────────→│ Return from │
└──────┬──────┘               │   Cache     │
       │ No                   └─────────────┘
       ↓
┌─────────────┐
│   Show      │
│  Offline    │
│   Page      │
└─────────────┘
```

---

## Future Architecture Improvements

### Phase 4-5 Enhancements

- Web Workers for processing
- Virtual scrolling for large PDFs
- Progressive thumbnail loading
- Batch operations
- Keyboard shortcuts

### Phase 6 Considerations

- Unit test coverage
- Integration tests
- Performance benchmarks
- Accessibility audit
- Security audit (especially vault)

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
