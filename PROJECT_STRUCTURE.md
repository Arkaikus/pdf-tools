# PDF Tools - Project Structure

## Current Structure

```
pdf-tools/
├── .dockerignore              # Docker ignore patterns
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore patterns
├── ARCHITECTURE.md            # Technical architecture documentation
├── bun-env.d.ts              # Bun TypeScript environment definitions
├── bun.lock                   # Bun lockfile for dependencies
├── bunfig.toml               # Bun configuration
├── CONTRIBUTING.md            # Contribution guidelines
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Multi-stage production Dockerfile
├── Makefile                   # Make commands for development
├── nginx.conf                 # Nginx configuration for production
├── package.json               # Project dependencies and scripts
├── PROJECT_STRUCTURE.md       # This file
├── README.md                  # Project overview and quick start
├── setup.sh                   # Quick setup script
├── TODO.md                    # Development roadmap and MVP plan
├── tsconfig.json             # TypeScript configuration
└── src/                      # Source code directory
    ├── index.html            # Main HTML entry point
    ├── index.ts              # Application entry point
    ├── index.css             # Global styles
    ├── frontend.tsx          # Frontend bootstrap
    ├── App.tsx               # Main App component
    ├── APITester.tsx         # API testing component (to be removed)
    ├── logo.svg              # Logo asset
    └── react.svg             # React logo asset
```

## Planned Structure (After Implementation)

```
pdf-tools/
├── Documentation
│   ├── README.md                    # Project overview
│   ├── TODO.md                      # Development roadmap
│   ├── ARCHITECTURE.md              # Technical documentation
│   ├── CONTRIBUTING.md              # Contribution guide
│   └── PROJECT_STRUCTURE.md         # This file
│
├── Configuration
│   ├── .dockerignore               # Docker ignore
│   ├── .env.example                # Environment template
│   ├── .gitignore                  # Git ignore
│   ├── bun-env.d.ts               # Bun types
│   ├── bunfig.toml                # Bun config
│   ├── docker-compose.yml         # Docker Compose
│   ├── Dockerfile                  # Docker image
│   ├── Makefile                    # Make commands
│   ├── nginx.conf                  # Nginx config
│   ├── package.json                # Dependencies
│   └── tsconfig.json              # TypeScript config
│
├── Scripts
│   └── setup.sh                    # Quick setup
│
└── src/                           # Source code
    ├── index.html                 # HTML entry
    ├── index.ts                   # App entry
    ├── index.css                  # Global styles
    │
    ├── components/                # Reusable components
    │   ├── common/               # Generic UI components
    │   │   ├── Button/
    │   │   │   ├── Button.tsx
    │   │   │   ├── Button.test.tsx
    │   │   │   └── index.ts
    │   │   ├── Modal/
    │   │   │   ├── Modal.tsx
    │   │   │   ├── Modal.test.tsx
    │   │   │   └── index.ts
    │   │   ├── Dropzone/
    │   │   │   ├── Dropzone.tsx
    │   │   │   ├── Dropzone.test.tsx
    │   │   │   └── index.ts
    │   │   ├── Toast/
    │   │   │   ├── Toast.tsx
    │   │   │   ├── ToastContainer.tsx
    │   │   │   └── index.ts
    │   │   └── Loader/
    │   │       ├── Loader.tsx
    │   │       └── index.ts
    │   │
    │   └── pdf/                  # PDF-specific components
    │       ├── PDFViewer/
    │       │   ├── PDFViewer.tsx
    │       │   ├── PDFViewer.test.tsx
    │       │   └── index.ts
    │       ├── PageThumbnail/
    │       │   ├── PageThumbnail.tsx
    │       │   └── index.ts
    │       ├── PageGrid/
    │       │   ├── PageGrid.tsx
    │       │   └── index.ts
    │       └── FileList/
    │           ├── FileList.tsx
    │           └── index.ts
    │
    ├── features/                 # Feature modules
    │   ├── jpg-to-pdf/
    │   │   ├── index.ts
    │   │   ├── JpgToPdf.tsx
    │   │   ├── components/
    │   │   │   ├── ImageUploader.tsx
    │   │   │   ├── ImagePreview.tsx
    │   │   │   └── ImageSettings.tsx
    │   │   ├── hooks/
    │   │   │   ├── useImageToPDF.ts
    │   │   │   └── useImageOptimizer.ts
    │   │   ├── utils/
    │   │   │   ├── imageConverter.ts
    │   │   │   └── imageConverter.test.ts
    │   │   └── types.ts
    │   │
    │   ├── merge-pdf/
    │   │   ├── index.ts
    │   │   ├── MergePdf.tsx
    │   │   ├── components/
    │   │   │   ├── PDFUploader.tsx
    │   │   │   ├── PDFList.tsx
    │   │   │   └── MergePreview.tsx
    │   │   ├── hooks/
    │   │   │   └── usePDFMerger.ts
    │   │   ├── utils/
    │   │   │   ├── pdfMerger.ts
    │   │   │   └── pdfMerger.test.ts
    │   │   └── types.ts
    │   │
    │   └── organize-pdf/
    │       ├── index.ts
    │       ├── OrganizePdf.tsx
    │       ├── components/
    │       │   ├── PageGrid.tsx
    │       │   ├── PageActions.tsx
    │       │   └── PageReorder.tsx
    │       ├── hooks/
    │       │   └── usePDFOrganizer.ts
    │       ├── utils/
    │       │   ├── pdfOrganizer.ts
    │       │   └── pdfOrganizer.test.ts
    │       └── types.ts
    │
    ├── hooks/                    # Shared custom hooks
    │   ├── useFileUpload.ts
    │   ├── usePDFProcessor.ts
    │   ├── useStorage.ts
    │   ├── useTheme.ts
    │   └── useToast.ts
    │
    ├── utils/                    # Utility functions
    │   ├── pdf/                 # PDF manipulation
    │   │   ├── pdfLib.ts
    │   │   ├── pdfRenderer.ts
    │   │   └── pdfValidator.ts
    │   ├── storage/             # Storage helpers
    │   │   ├── indexedDB.ts
    │   │   └── localStorage.ts
    │   ├── file/                # File utilities
    │   │   ├── fileValidator.ts
    │   │   ├── fileConverter.ts
    │   │   └── fileSaver.ts
    │   └── helpers/             # General helpers
    │       ├── format.ts
    │       └── debounce.ts
    │
    ├── workers/                  # Web Workers
    │   ├── pdf.worker.ts
    │   └── image.worker.ts
    │
    ├── types/                    # TypeScript definitions
    │   ├── global.d.ts
    │   ├── pdf.types.ts
    │   └── storage.types.ts
    │
    ├── styles/                   # Styles
    │   ├── globals.css
    │   ├── variables.css
    │   └── themes/
    │       ├── light.css
    │       └── dark.css
    │
    ├── contexts/                 # React contexts
    │   ├── AppContext.tsx
    │   ├── ThemeContext.tsx
    │   └── ToastContext.tsx
    │
    └── layouts/                  # Layout components
        ├── MainLayout.tsx
        ├── Header.tsx
        └── Footer.tsx
```

## File Descriptions

### Root Level Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview, quick start guide, features |
| `TODO.md` | Complete development roadmap and MVP plan |
| `ARCHITECTURE.md` | Technical architecture documentation |
| `CONTRIBUTING.md` | Contribution guidelines and development workflow |
| `PROJECT_STRUCTURE.md` | This file - project structure overview |
| `package.json` | Project dependencies and npm scripts |
| `tsconfig.json` | TypeScript compiler configuration |
| `bunfig.toml` | Bun runtime configuration |
| `Dockerfile` | Multi-stage Docker image definition |
| `docker-compose.yml` | Docker Compose orchestration |
| `nginx.conf` | Nginx web server configuration |
| `Makefile` | Make commands for development tasks |
| `setup.sh` | Automated setup script for new developers |
| `.env.example` | Environment variables template |
| `.dockerignore` | Files to ignore in Docker builds |
| `.gitignore` | Files to ignore in Git |

### Source Directory (`src/`)

#### Entry Points
- `index.html` - Main HTML file
- `index.ts` - Application bootstrap
- `frontend.tsx` - React application entry
- `App.tsx` - Root React component

#### Components (`components/`)
- `common/` - Reusable UI components (buttons, modals, etc.)
- `pdf/` - PDF-specific components (viewer, thumbnails, etc.)

#### Features (`features/`)
Each feature is self-contained with:
- Main component
- Sub-components
- Custom hooks
- Utility functions
- Type definitions

#### Hooks (`hooks/`)
Shared custom React hooks for:
- File upload handling
- PDF processing
- Storage operations
- Theme management
- Toast notifications

#### Utils (`utils/`)
- `pdf/` - PDF manipulation utilities
- `storage/` - IndexedDB and LocalStorage wrappers
- `file/` - File validation and conversion
- `helpers/` - General utility functions

#### Workers (`workers/`)
Web Workers for heavy processing:
- `pdf.worker.ts` - PDF processing in background
- `image.worker.ts` - Image processing in background

#### Types (`types/`)
TypeScript type definitions for:
- Global types
- PDF-related types
- Storage types

#### Styles (`styles/`)
- Global styles
- CSS variables
- Theme definitions

## Key Design Patterns

### 1. Feature Module Pattern
Each feature is self-contained and follows:
```
feature/
├── index.ts          # Public API
├── Component.tsx     # Main component
├── components/       # Sub-components
├── hooks/           # Feature hooks
├── utils/           # Feature utilities
└── types.ts         # Feature types
```

### 2. Component Structure
```typescript
// Component.tsx
import { FC } from 'react';
import type { ComponentProps } from './types';

export const Component: FC<ComponentProps> = (props) => {
  // Implementation
};

// index.ts
export { Component } from './Component';
export type { ComponentProps } from './types';
```

### 3. Hook Pattern
```typescript
// useFeature.ts
export const useFeature = (options: Options) => {
  const [state, setState] = useState(initialState);
  
  const methods = {
    // Methods
  };
  
  return { state, ...methods };
};
```

### 4. Utility Pattern
```typescript
// utility.ts
export const utilityFunction = (input: Input): Output => {
  // Implementation
};

// utility.test.ts
describe('utilityFunction', () => {
  test('should...', () => {
    // Test
  });
});
```

## Development Workflow

### 1. Adding a New Feature
```bash
# 1. Create feature directory
mkdir -p src/features/new-feature/{components,hooks,utils}

# 2. Create files
touch src/features/new-feature/{index.ts,NewFeature.tsx,types.ts}

# 3. Implement feature
# 4. Add tests
# 5. Update documentation
```

### 2. Adding a New Component
```bash
# 1. Create component directory
mkdir -p src/components/common/NewComponent

# 2. Create files
touch src/components/common/NewComponent/{NewComponent.tsx,index.ts}

# 3. Implement component
# 4. Export from index.ts
```

### 3. Running the Project
```bash
# Development
bun dev

# Build
bun run build

# Docker
make docker-build && make docker-up
```

## Next Steps

See [TODO.md](TODO.md) for the complete development roadmap.

**Immediate priorities:**
1. Install PDF manipulation libraries
2. Create folder structure
3. Implement file upload component
4. Build JPG to PDF converter (first feature)

---

Last Updated: 2026-02-04
