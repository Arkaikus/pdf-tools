# Installation Guide

## Quick Start

```bash
# 1. Navigate to project directory
cd /home/arkaikus/Docker/pdf-tools

# 2. Run setup script (recommended)
./setup.sh

# 3. Start development
bun dev
```

## Manual Installation

### Prerequisites

- **Bun** v1.1 or higher ([Install Bun](https://bun.sh))
- **Docker** (optional, for containerized deployment)
- **Git** (optional, for version control)

### Step-by-Step

#### 1. Install Dependencies

```bash
bun install
```

This will install:

**Production Dependencies:**
- `react` v19 - UI library
- `react-dom` v19 - React DOM renderer

**Development Dependencies:**
- `@types/react` - React TypeScript types
- `@types/react-dom` - React DOM TypeScript types
- `@types/bun` - Bun TypeScript types
- `bun-plugin-tailwind` - Tailwind CSS Bun plugin
- `tailwindcss` v4 - Utility-first CSS framework
- `postcss` - CSS transformation tool
- `autoprefixer` - Auto-add vendor prefixes
- `@tailwindcss/postcss` - Tailwind v4 PostCSS plugin

#### 2. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit if needed (optional)
nano .env
```

#### 3. Verify Installation

```bash
# Check Bun version
bun --version

# Check if dependencies installed
ls node_modules/
```

## Running the Application

### Development Mode

```bash
# Start dev server with hot reload
bun dev

# Access at http://localhost:3000
```

### Production Build

```bash
# Build for production
bun run build

# Run production build
bun start
```

### Using Make Commands

```bash
# Development
make install    # Install dependencies
make dev        # Start dev server
make build      # Build for production

# Docker
make docker-build    # Build Docker image
make docker-up       # Start containers
make docker-down     # Stop containers
make docker-logs     # View logs

# Quick start with Docker
make quick-start
```

## Docker Installation

### Build and Run

```bash
# Build Docker image
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f pdf-tools

# Stop containers
docker-compose down
```

### Access the Application

- **Production**: http://localhost:3000
- **Development** (with profile): http://localhost:3001

### Docker Development Mode

```bash
# Start with dev profile
docker-compose --profile dev up pdf-tools-dev
```

## Verifying Installation

### Check Dev Server

1. Start the dev server:
   ```bash
   bun dev
   ```

2. Open browser to `http://localhost:3000`

3. You should see the PDF Tools welcome page

### Check Tailwind CSS

Create a test component:

```tsx
// src/Test.tsx
export const Test = () => (
  <div className="bg-primary-500 text-white p-4 rounded-lg">
    Tailwind is working!
  </div>
);
```

If you see a blue background with white text, Tailwind is configured correctly.

## Troubleshooting

### Bun not found

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Add to PATH (if needed)
export PATH="$HOME/.bun/bin:$PATH"

# Verify
bun --version
```

### Dependencies not installing

```bash
# Clear cache and reinstall
rm -rf node_modules bun.lock
bun install
```

### Tailwind styles not working

```bash
# 1. Check bunfig.toml has plugin
cat bunfig.toml | grep tailwind

# 2. Check index.css has directives
head -n 5 src/index.css

# 3. Restart dev server
bun dev
```

### Port already in use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 bun dev
```

### Docker build fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Permission denied on setup.sh

```bash
# Make executable
chmod +x setup.sh

# Run
./setup.sh
```

## Adding PDF Libraries

For PDF manipulation features, install:

```bash
bun add pdf-lib pdfjs-dist file-saver idb
```

**Libraries:**
- `pdf-lib` - Create and modify PDFs
- `pdfjs-dist` - Render and preview PDFs
- `file-saver` - Download files client-side
- `idb` - IndexedDB wrapper

## IDE Setup

### VS Code

Recommended extensions:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "oven.bun-vscode"
  ]
}
```

Create `.vscode/extensions.json`:

```bash
mkdir -p .vscode
cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "oven.bun-vscode"
  ]
}
EOF
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
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Next Steps

1. **Read Documentation**
   - [README.md](README.md) - Project overview
   - [TODO.md](TODO.md) - Development roadmap
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
   - [TAILWIND.md](TAILWIND.md) - Tailwind CSS guide

2. **Start Development**
   - Explore `src/` directory
   - Check existing components
   - Read [CONTRIBUTING.md](CONTRIBUTING.md)

3. **Build Features**
   - Follow roadmap in [TODO.md](TODO.md)
   - Implement JPG to PDF first
   - Test in multiple browsers

## Getting Help

- Check [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- See [TODO.md](TODO.md) for feature roadmap
- Read [TAILWIND.md](TAILWIND.md) for styling guide

---

**Installation Complete!** 🎉

Start developing:
```bash
bun dev
```
