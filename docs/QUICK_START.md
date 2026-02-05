# Quick Start Guide

## Installation

```bash
cd /home/arkaikus/Docker/pdf-tools

# Install dependencies
bun install

# Install PDF libraries
bun add pdf-lib pdfjs-dist file-saver idb clsx
bun add -d @types/file-saver
```

## Run Development Server

```bash
bun dev
```

Open `http://localhost:3000` in your browser.

## Test the JPG to PDF Feature

1. Click on "JPG to PDF" on the home page
2. Drag and drop images or click to browse
3. Adjust settings (page size, orientation, margins)
4. Click "Convert to PDF"
5. PDF will automatically download

## Build for Production

```bash
bun run build
```

## Run with Docker

```bash
# Build and start
make quick-start

# Or manually
docker-compose build
docker-compose up -d

# Access at http://localhost:3000
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── features/        # Feature modules (JPG to PDF ready!)
├── layouts/         # App layout (Header, Footer)
├── pages/           # Routes (Home page)
├── utils/           # Utilities (storage, PDF, file handling)
├── contexts/        # React contexts (Toast)
└── types/           # TypeScript definitions
```

## Available Routes

- `/` - Home page with tool selection
- `/#/jpg-to-pdf` - JPG to PDF converter (READY!)

## What's Implemented

✅ Complete JPG to PDF converter with:
- Drag & drop file upload
- Multiple image support
- Customizable PDF settings
- Progress indicators
- Error handling

✅ Infrastructure:
- Tailwind CSS styling
- IndexedDB storage
- LocalStorage settings
- Toast notifications
- Responsive layouts

## Next Steps

See [TODO.md](TODO.md) for the complete roadmap.

Next features to implement:
1. Merge PDF
2. Organize PDF
3. Split PDF

---

Happy coding! 🚀
