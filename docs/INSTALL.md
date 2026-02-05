# Installation Guide

Complete guide to installing and running PDF Tools locally or with Docker.

---

## Quick Start

```bash
# Navigate to project directory
cd /home/arkaikus/Docker/pdf-tools

# Install dependencies
bun install

# Setup PDF.js worker (REQUIRED)
bun run setup:worker

# Start development server
bun dev

# Access at http://localhost:3333
```

---

## Prerequisites

### Required
- **Bun** v1.1 or higher - [Install Bun](https://bun.sh)
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

### Optional
- **Docker** & **Docker Compose** - For containerized deployment
- **Git** - For version control
- **Make** - For convenience commands

---

## Local Development Setup

### 1. Install Dependencies

```bash
bun install
```

This installs all required dependencies:

**Production Dependencies:**
- `react` ^19 - UI framework
- `react-dom` ^19 - React DOM renderer
- `react-router-dom` ^6.26.0 - Client-side routing
- `react-icons` ^5.3.0 - Icon library (Font Awesome)
- `pdf-lib` ^1.17.1 - PDF creation and manipulation
- `pdfjs-dist` ^4.0.379 - PDF rendering and thumbnails
- `file-saver` ^2.0.5 - Client-side file downloads
- `idb` ^8.0.0 - IndexedDB wrapper
- `clsx` ^2.1.0 - CSS class utility

**Development Dependencies:**
- `@types/react` ^19 - React TypeScript types
- `@types/react-dom` ^19 - React DOM TypeScript types
- `@types/bun` latest - Bun TypeScript types
- `@types/file-saver` ^2.0.7 - File-saver types
- `bun-plugin-tailwind` latest - Tailwind CSS Bun plugin
- `tailwindcss` latest - Tailwind CSS v4
- `postcss` latest - CSS transformation
- `autoprefixer` latest - Vendor prefix automation
- `@tailwindcss/postcss` latest - Tailwind v4 PostCSS plugin

### 2. Setup PDF.js Worker (Required)

After installing dependencies, you MUST run the worker setup script:

```bash
bun run setup:worker
```

This copies `pdf.worker.min.mjs` from `node_modules/pdfjs-dist/build/` to `public/` directory.

**Note:** This is NOT automatic - you must run it manually after `bun install`.

### 3. Start Development Server

```bash
bun dev
```

- Server runs at: **http://localhost:3333**
- Hot-reload enabled
- Console logs from browser echo to terminal

### 4. Verify Installation

Open browser to `http://localhost:3333`

You should see:
- PDF Tools homepage
- Three tool cards: JPG to PDF, Merge PDF, Organize PDF
- Task queue icon in header

---

## Production Build

### Build for Production

```bash
bun run build
```

This:
1. Runs PDF.js worker setup
2. Bundles the application
3. Copies public assets to dist/
4. Minifies code
5. Generates source maps

Output directory: `dist/`

### Run Production Build

```bash
bun start
```

Starts production server at `http://localhost:3333`

---

## Docker Deployment

### Using Docker Compose (Recommended)

#### Build and Start

```bash
# Build image and start container
docker-compose up -d

# View logs
docker-compose logs -f pdf-tools

# Stop container
docker-compose down
```

Access at: **http://localhost:3000**

#### Using Make Commands

```bash
# Build Docker image
make docker-build

# Start containers
make docker-up

# Stop containers
make docker-down

# View logs
make docker-logs

# Complete rebuild
make docker-rebuild
```

### Manual Docker Build

```bash
# Build image
docker build -t pdf-tools .

# Run container
docker run -d -p 3000:80 --name pdf-tools pdf-tools

# View logs
docker logs -f pdf-tools

# Stop container
docker stop pdf-tools
docker rm pdf-tools
```

---

## Make Commands

The project includes a Makefile with convenient commands:

### Development
```bash
make install       # Install dependencies
make dev          # Start dev server
make build        # Build for production
make start        # Run production server
make clean        # Clean build artifacts
```

### Docker
```bash
make docker-build    # Build Docker image
make docker-up       # Start containers
make docker-down     # Stop containers
make docker-logs     # View container logs
make docker-shell    # Shell into container
make docker-rebuild  # Rebuild from scratch
```

### Maintenance
```bash
make clean           # Remove dist/
make clean-all       # Remove dist/ and node_modules/
make help           # Show all commands
```

---

## Project Structure

After installation, your project structure:

```
pdf-tools/
├── public/
│   └── pdf.worker.min.mjs    # PDF.js worker (auto-generated)
├── src/
│   ├── components/           # UI components
│   ├── features/             # Feature modules
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main app component
│   ├── index.tsx            # React entry point
│   └── index.ts             # Bun server
├── scripts/
│   └── setup-pdfjs-worker.sh  # Worker setup script
├── docs/                     # Documentation
├── dist/                     # Build output (generated)
├── node_modules/             # Dependencies (generated)
├── package.json
├── bunfig.toml
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── Makefile
```

---

## Troubleshooting

### Bun Not Found

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Reload shell or add to PATH
export PATH="$HOME/.bun/bin:$PATH"

# Verify installation
bun --version
```

### Dependencies Won't Install

```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install

# If still failing, check Bun version
bun --version  # Should be 1.1+
```

### PDF.js Worker Error

If you see: `Failed to fetch dynamically imported module: pdf.worker.min.js`

```bash
# Run worker setup manually
bun run setup:worker

# Verify file exists
ls -la public/pdf.worker.min.mjs

# Restart dev server
bun dev
```

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed fix.

### Port Already in Use

```bash
# Find process using port 3333
lsof -i :3333

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3334 bun dev
```

### Tailwind Styles Not Working

```bash
# Check bunfig.toml has plugin
cat bunfig.toml | grep tailwind

# Should show: plugins = ["bun-plugin-tailwind"]

# Check index.css has directives
head src/index.css

# Should include: @import "tailwindcss";

# Restart dev server
bun dev
```

### Docker Build Fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check Docker version
docker --version
docker-compose --version
```

### Hot Reload Not Working

```bash
# Restart with clean cache
rm -rf .bun
bun dev

# If still not working, try hard refresh in browser
# Windows/Linux: Ctrl + Shift + R
# Mac: Cmd + Shift + R
```

---

## Environment Variables

The project includes `.env.example` for reference. No environment variables are required for basic operation.

```bash
# Optional: Copy example
cp .env.example .env

# Edit if needed
nano .env
```

Currently, no environment variables are used in the application.

---

## IDE Setup (VS Code)

### Recommended Extensions

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "oven.bun-vscode",
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}
```

### Settings

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## Verification Checklist

After installation, verify everything works:

- [ ] `bun --version` shows 1.1+
- [ ] `bun dev` starts without errors
- [ ] Browser opens to `http://localhost:3333`
- [ ] Homepage loads with 3 tool cards
- [ ] Task queue icon visible in header
- [ ] `ls public/pdf.worker.min.mjs` shows file exists
- [ ] No console errors in browser DevTools

---

## Next Steps

After successful installation:

1. **Read the User Guide**: [docs/USER_GUIDE.md](USER_GUIDE.md)
2. **Explore Features**: Try JPG to PDF, Merge PDF, Organize PDF
3. **Check Architecture**: [docs/ARCHITECTURE.md](ARCHITECTURE.md)
4. **Review Roadmap**: [docs/TODO.md](TODO.md)

---

## Getting Help

If you encounter issues:

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review browser console for errors (F12)
3. Check terminal output for server errors
4. Verify all prerequisites are met
5. Try clean install: `rm -rf node_modules bun.lockb && bun install && bun run setup:worker`

---

**Installation Complete!** 🎉

Start developing:
```bash
# Make sure you ran setup:worker first!
bun dev
```

Access the app at: **http://localhost:3333**

**Important:** If you see PDF.js worker errors, run `bun run setup:worker` first!
