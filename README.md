# PDF Tools MVP

A privacy-focused, frontend-only PDF manipulation tool built with React and Bun. Process your PDFs entirely in your browser - no data ever leaves your device.

**🎉 MVP COMPLETE!** All 3 core features + Task Queue system are fully functional and ready to use!

## ✨ Features

### 🎉 MVP COMPLETE - All Core Features Ready!

**Task Queue System**
- Track all PDF processing tasks
- 5-character unique task IDs
- Download results multiple times
- 24-hour result persistence
- Visual status tracking
- Error debugging
- Task statistics dashboard

### PDF Tools ✅
- **JPG to PDF** - Convert images to PDF with customizable settings
  - Multiple images support
  - Drag & drop reordering
  - Page size selection (A4, Letter, Legal)
  - Orientation control (Portrait/Landscape)
  - Adjustable margins
  - Fit to page & aspect ratio options

- **Merge PDF** - Combine multiple PDFs into one
  - Upload multiple PDF files
  - Drag & drop to reorder
  - Select specific page ranges per file
  - Visual page count display
  - Automatic merge and download

- **Organize PDF** - Manipulate PDF pages visually
  - Upload single PDF
  - Visual page thumbnails
  - Drag & drop to reorder pages
  - Rotate pages (left/right)
  - Delete pages (with restore)
  - Save organized PDF

### Coming Soon (Phase 4) 🔜
- **Split PDF** - Extract pages or split into multiple files
- **Compress PDF** - Reduce file size
- **PDF to JPG** - Convert PDF pages to images
- **Add Watermark** - Text or image watermarks
- **Password Protection** - Encrypt/decrypt PDFs
- **Batch Operations** - Process multiple files at once

## 🛡️ Privacy First

- **100% Client-Side Processing** - All PDF operations happen in your browser
- **No Data Upload** - Your files never touch a server
- **Offline Capable** - Works without an internet connection
- **No Tracking** - No analytics or data collection
- **Open Source** - Full transparency in what we do

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
bun install

# Install PDF libraries
bun add pdf-lib pdfjs-dist file-saver idb clsx
bun add -d @types/file-saver

# Start development server
bun dev

# Access at http://localhost:3000
```

### Using Docker (Recommended)

```bash
# Quick start (build and run)
make quick-start

# Or manually
docker-compose up -d

# Access at http://localhost:3000
```

### Build for Production

```bash
bun run build
bun start
```

## 📋 Available Commands

```bash
# Development
make install       # Install dependencies
make dev           # Start dev server
make build         # Production build

# Docker
make docker-build  # Build Docker image
make docker-up     # Start containers
make docker-down   # Stop containers
make docker-logs   # View logs

# Maintenance
make clean         # Clean build artifacts
make clean-all     # Clean everything
```

## 🏗️ Tech Stack

- **Frontend**: React 19
- **Runtime**: Bun
- **Styling**: Tailwind CSS v4
- **PDF Library**: pdf-lib, pdfjs-dist
- **Storage**: IndexedDB + LocalStorage
- **Container**: Docker + Nginx

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── common/        # Shared components
│   └── pdf/           # PDF-specific components
├── features/          # Feature modules
│   ├── jpg-to-pdf/
│   ├── merge-pdf/
│   └── organize-pdf/
├── hooks/             # Custom React hooks
├── utils/             # Helper functions
│   ├── pdf/          # PDF utilities
│   └── storage/      # Storage helpers
└── types/             # TypeScript types
```

## 🐳 Docker Details

The project includes:
- **Multi-stage Dockerfile** - Optimized production build
- **Nginx configuration** - Fast static file serving
- **Docker Compose** - Easy orchestration
- **Development mode** - Hot-reload in container

### Production Container
```bash
docker-compose up -d pdf-tools
```
Accessible at `http://localhost:3000`

### Development Container
```bash
docker-compose --profile dev up pdf-tools-dev
```
Accessible at `http://localhost:3001`

## 📚 Documentation

### 🚀 Getting Started

| Document | Description |
|----------|-------------|
| **[START_HERE.md](START_HERE.md)** | 👋 First-time user guide - Your entry point to the project |
| **[QUICK_START.md](QUICK_START.md)** | ⚡ Quick setup guide - Get running in 5 minutes |
| **[docs/INSTALL.md](docs/INSTALL.md)** | 📦 Comprehensive installation guide with troubleshooting |
| **[CHANGELOG.md](CHANGELOG.md)** | 📝 Version history and what's new in each release |

### 🏗️ Architecture & Technical

| Document | Description |
|----------|-------------|
| **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** | 🏛️ System design, component structure, and technical decisions |
| **[docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)** | 📁 File organization and directory layout explanation |
| **[docs/TAILWIND.md](docs/TAILWIND.md)** | 🎨 Tailwind CSS v4 configuration and styling guide |
| **[docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)** | 📊 Visual project overview with statistics and metrics |

### ✨ Feature Documentation

| Document | Description |
|----------|-------------|
| **[docs/MVP_COMPLETE.md](docs/MVP_COMPLETE.md)** | 🎉 MVP completion summary - All features delivered! |
| **[docs/FINAL_SUMMARY.md](docs/FINAL_SUMMARY.md)** | 📋 Comprehensive project handover document |
| **[docs/MERGE_PDF_COMPLETE.md](docs/MERGE_PDF_COMPLETE.md)** | 📄 Merge PDF feature - Implementation and usage |
| **[docs/ORGANIZE_PDF_COMPLETE.md](docs/ORGANIZE_PDF_COMPLETE.md)** | 🔄 Organize PDF feature - Reorder, rotate, delete pages |
| **[docs/TASK_QUEUE_COMPLETE.md](docs/TASK_QUEUE_COMPLETE.md)** | 📋 Task queue system - Tracking and result management |

### 🔧 Development & Maintenance

| Document | Description |
|----------|-------------|
| **[TODO.md](TODO.md)** | 📝 Development roadmap and task tracking |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | 🤝 Contribution guidelines and development workflow |
| **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** | 🐛 Common issues, solutions, and debugging guide |
| **[docs/PDFJS_WORKER_FIX.md](docs/PDFJS_WORKER_FIX.md)** | 🔨 PDF.js worker configuration and CDN fix |
| **[docs/SETUP_COMPLETE.md](docs/SETUP_COMPLETE.md)** | ✅ Initial setup completion checklist |
| **[docs/IMPLEMENTATION_COMPLETE.md](docs/IMPLEMENTATION_COMPLETE.md)** | 🎯 Feature implementation status and completeness |
| **[docs/UPDATES.md](docs/UPDATES.md)** | 🔄 Recent updates and changes log |

### 📖 Quick Reference

```bash
# New to the project?
Start with: START_HERE.md → QUICK_START.md → docs/INSTALL.md

# Want to understand the system?
Read: docs/ARCHITECTURE.md → docs/PROJECT_STRUCTURE.md

# Ready to contribute?
Check: CONTRIBUTING.md → TODO.md

# Having issues?
See: docs/TROUBLESHOOTING.md → docs/PDFJS_WORKER_FIX.md

# Want to see what's complete?
Review: docs/MVP_COMPLETE.md → docs/FINAL_SUMMARY.md
```

## 📝 Roadmap

See [TODO.md](TODO.md) for the complete development roadmap.

### Phase 1: Foundation ✅ COMPLETE
- ✅ Setup infrastructure
- ✅ Core UI components
- ✅ Docker configuration
- ✅ Tailwind CSS integration
- ✅ IndexedDB & LocalStorage

### Phase 2: Core Features ✅ COMPLETE
- ✅ JPG to PDF converter
- ✅ Merge PDF tool
- ✅ Organize PDF tool
- ✅ Task Queue system

### Phase 3: MVP Complete ✅ DELIVERED
- ✅ All 3 PDF tools functional
- ✅ Task queue with persistence
- ✅ Drag & drop interfaces
- ✅ Privacy-first architecture
- ✅ Production-ready Docker setup

### Phase 4: Future Enhancements 🚀
- Split, Compress, Watermark
- PDF to Image conversion
- Password protection
- Batch operations

## 🤝 Contributing

Contributions are welcome! Please read the [TODO.md](TODO.md) for development guidelines and feature roadmap.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🔒 Security

All processing happens client-side. No files are uploaded to any server. The application uses:
- IndexedDB for temporary file storage (auto-cleanup after 24h)
- LocalStorage for user preferences only
- Content Security Policy headers
- No external API calls

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Requires modern browser with support for:
- Web Workers
- IndexedDB
- File System Access API (optional)

---

Built with ❤️ using [Bun](https://bun.sh) and [React](https://react.dev)
