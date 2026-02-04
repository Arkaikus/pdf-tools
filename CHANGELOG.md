# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed - 2026-02-04

#### Documentation Updates
- Updated `README.md` with documentation table of contents for `docs/` directory
- Added organized categories: Getting Started, Architecture, Features, Development
- Added quick summaries for each document
- Updated roadmap section to reflect Phase 1-3 completion

### Fixed - 2026-02-04

#### PDF.js Worker Error Resolution
- **Fixed Critical Bug** - PDF.js worker failing to load from CDN
  - Error: "Failed to fetch dynamically imported module" when uploading PDFs
  - **Root Cause**: CORS and network issues with CDN-hosted worker
  - **Solution**: Local worker file serving
  
**Changes Made:**
- Created `public/` directory for static assets
- Copied `pdf.worker.min.mjs` from `pdfjs-dist` package to `public/`
- Updated `pdfRenderer.ts` to use local worker: `workerSrc = '/pdf.worker.min.mjs'`
- Added route in `src/index.ts` to serve worker file in development
- Created automated setup script: `scripts/setup-pdfjs-worker.sh`
- Added `postinstall` script to automatically copy worker after `bun install`
- Updated build script to copy `public/` files to `dist/`
- Updated Dockerfile to include public assets in production image
- Created `TROUBLESHOOTING.md` with comprehensive debugging guide

**Impact:**
- ✅ Organize PDF feature now works reliably
- ✅ No external CDN dependencies
- ✅ Works offline
- ✅ Faster load times
- ✅ Better security (no external requests)

### Added - 2026-02-04

#### Task Queue System
- **Complete Task Management** with IndexedDB persistence
  - Auto-generated 5-character task IDs (e.g., "A3X9K")
  - Task status tracking: processing, completed, failed
  - Store input/output files as blobs in IndexedDB
  - 24-hour auto-cleanup
  - Task queue icon in header with badge
  - Dedicated task queue page at `/tasks`
  - Statistics dashboard (total, processing, completed, failed)
  - Download results multiple times
  - Clear individual or all tasks
  - Error tracking and display

**Technical Implementation:**
- Extended IndexedDB schema with tasks store
- `useTaskQueue` hook for state management
- Integrated with JPG to PDF and Merge PDF tools
- Task statistics and filtering
- Blob storage for output files

#### Organize PDF Feature (Phase 3.3)
- **Complete PDF Organization Tool** - Manipulate PDF pages visually
  - Upload single PDF with thumbnail generation
  - Drag & drop to reorder pages
  - Rotate pages (±90° with visual preview)
  - Delete pages (soft delete with restore)
  - Visual page grid (responsive 2-4 columns)
  - Grip handle for dragging
  - Page number badges
  - Deleted pages section
  - File info panel (total/active/deleted counts)
  - Save organized PDF with all operations applied
  - Task queue integration

**Technical Implementation:**
- `pdfOrganizer.ts` - Page manipulation utilities
- `pdfRenderer.ts` - PDF.js thumbnail generation
- `useOrganizePDF` hook - State and operations management
- `PageThumbnail` component - Individual page display
- `OrganizePdf` component - Main interface with sticky sidebar
- Full drag & drop with visual feedback

#### Merge PDF Feature (Phase 3.2)
- **Complete PDF Merging Tool** - Combine multiple PDFs into one
  - Upload multiple PDF files with drag & drop
  - Reorder files by dragging (merge order)
  - Select specific page ranges for each PDF
  - Page range syntax: "all", "1-3", "1,3,5", "1-3,5,7-10"
  - Real-time page count display
  - Progress indicator during merge
  - Automatic download of merged PDF

**Technical Implementation:**
- `pdfMerger.ts` - PDF merging utilities with page range parser
- `usePDFMerger` hook - State management for merge operations
- `MergePdf.tsx` - Main component with sticky sidebar
- `PDFFileItem.tsx` - Individual PDF file display with page range input
- Full validation and error handling

### Added - 2026-02-04 (Earlier)

#### Drag and Drop File Reordering
- Added drag and drop functionality to reorder uploaded images in JPG to PDF tool
- Visual feedback during drag (opacity change, border highlight)
- Grip handle icon to indicate draggable items
- Helper text "Drag and drop to reorder images"

#### Improved Layout
- Made right column sticky in JPG to PDF tool for better UX
- Moved "Convert to PDF" button to sticky sidebar
- Button stays visible while scrolling through long file lists
- Settings and info panel remain accessible during scrolling

#### React Router & Icons
- Replaced hash-based routing with `react-router-dom`
- Clean URLs (e.g., `/jpg-to-pdf` instead of `/#/jpg-to-pdf`)
- Replaced all inline SVGs with `react-icons/fa` (Font Awesome)
- Consistent icon library throughout the app

### Technical Details

**File Changes:**
- `src/components/pdf/FileList/FileList.tsx` - Added drag and drop reordering
- `src/features/jpg-to-pdf/hooks/useImageToPDF.ts` - Added `reorderFiles` function
- `src/features/jpg-to-pdf/JpgToPdf.tsx` - Restructured layout with sticky sidebar
- `src/App.tsx` - Implemented React Router
- Multiple component files - Updated to use react-icons

**New Features:**
- `onReorder` prop in FileList component
- `reorderFiles` function in useImageToPDF hook
- Sticky positioning for settings sidebar
- Drag state management with visual feedback

**Dependencies Added:**
- `react-router-dom` v6.26.0
- `react-icons` v5.3.0

### User Experience Improvements

1. **File Ordering**: Users can now arrange images in the exact order they want for the PDF
2. **Sticky Controls**: Convert button and settings remain visible during scrolling
3. **Better Navigation**: Clean URLs and proper routing
4. **Consistent Icons**: Professional icon set throughout

### Breaking Changes

None - All changes are backwards compatible

## [0.1.0] - 2026-02-04

### Added

#### Initial MVP Release
- JPG to PDF converter (fully functional)
  - Multiple image upload (JPG, PNG, WebP)
  - Drag and drop file upload
  - Customizable PDF settings (page size, orientation, margins)
  - Real-time preview with thumbnails
  - Progress indicator during conversion
  - Automatic PDF download

#### Infrastructure
- Tailwind CSS v4 styling system
- IndexedDB storage with auto-cleanup
- LocalStorage for user settings
- Toast notification system
- Modal components
- File upload components
- Responsive layouts

#### Core Features
- Home page with tool grid
- Header and footer navigation
- Privacy-first architecture
- Client-side only processing
- Error handling and validation

#### Documentation
- Complete README with setup instructions
- TODO.md with development roadmap
- ARCHITECTURE.md with technical details
- Multiple setup and installation guides

---

**Note**: This project follows [Semantic Versioning](https://semver.org/).

## Version Format

- **Major** version for incompatible API changes
- **Minor** version for backwards-compatible functionality additions
- **Patch** version for backwards-compatible bug fixes
