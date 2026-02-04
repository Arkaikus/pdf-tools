# PDF Tools MVP

A privacy-focused, frontend-only PDF manipulation tool built with React and Bun. Process your PDFs entirely in your browser - no data ever leaves your device.

## ✨ Features

### Ready to Use ✅
- **JPG to PDF** - Convert images to PDF with customizable settings
  - Multiple images support
  - Page size selection (A4, Letter, Legal)
  - Orientation control (Portrait/Landscape)
  - Adjustable margins
  - Fit to page & aspect ratio options

### Coming Soon 🔜
- **Merge PDF** - Combine multiple PDFs into one
- **Organize PDF** - Reorder, rotate, and delete pages
- **Split PDF** - Extract pages or split into multiple files
- **Compress PDF** - Reduce file size
- **PDF to JPG** - Convert PDF pages to images
- **Add Watermark** - Text or image watermarks
- **Rotate PDF** - Rotate pages in bulk

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

- **[INSTALL.md](INSTALL.md)** - Complete installation guide
- **[TODO.md](TODO.md)** - Development roadmap
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture
- **[TAILWIND.md](TAILWIND.md)** - Tailwind CSS guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Project structure

## 📝 Roadmap

See [TODO.md](TODO.md) for the complete development roadmap.

### Phase 1: Foundation ⏳
- Setup infrastructure
- Core UI components
- Docker configuration

### Phase 2: Core Features 📋
- JPG to PDF converter
- Merge PDF tool
- Organize PDF tool

### Phase 3: Additional Features 🚀
- Split, Compress, Watermark
- PDF to Image conversion
- Advanced editing

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
