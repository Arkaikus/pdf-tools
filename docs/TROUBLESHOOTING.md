# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### PDF.js Worker Error

**Error Message:**
```
Uncaught TypeError: Failed to fetch dynamically imported module: 
http://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js
```

**Symptoms:**
- Error occurs when uploading PDF files to the Organize PDF tool
- Thumbnails fail to generate
- PDF operations hang or fail

**Root Cause:**
The PDF.js library requires a web worker to process PDF files. Originally, we tried to load this from a CDN, but this can fail due to:
- CORS (Cross-Origin Resource Sharing) restrictions
- Network connectivity issues
- Content Security Policy (CSP) restrictions
- Missing internet connection

**Solution:**
We now serve the PDF.js worker file locally from the application.

**Fix Applied:**

1. **Worker File Location:**
   - The worker file is copied to: `public/pdf.worker.min.mjs`
   - It's automatically served at: `http://localhost:3333/pdf.worker.min.mjs`

2. **Configuration Updated:**
   ```typescript
   // src/utils/pdf/pdfRenderer.ts
   pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
   ```

3. **Development Server:**
   ```typescript
   // src/index.ts - Added route to serve worker file
   "/pdf.worker.min.mjs": async () => {
     const file = Bun.file("./public/pdf.worker.min.mjs");
     return new Response(file, {
       headers: {
         "Content-Type": "application/javascript",
       },
     });
   }
   ```

4. **Automated Setup:**
   - Added postinstall script that runs automatically after `bun install`
   - Copies worker from `node_modules/pdfjs-dist/build/` to `public/`
   - Manual setup: `bun run setup:worker`

5. **Production Build:**
   - Updated build script to copy `public/` directory to `dist/`
   - Dockerfile includes public files in the nginx image

**How to Apply the Fix:**

```bash
# 1. Run the setup script (copies worker file)
bun run setup:worker

# 2. Restart the development server
# Press Ctrl+C to stop the current server, then:
bun dev

# 3. Test the Organize PDF feature
# Navigate to http://localhost:3333/organize-pdf
# Upload a PDF file - it should now work without errors
```

**Verification:**

1. Check that the worker file exists:
   ```bash
   ls -lh public/pdf.worker.min.mjs
   # Should show: -rwxrwxrwx 1 user group 1.4M date pdf.worker.min.mjs
   ```

2. Check that the worker is being served:
   ```bash
   curl -I http://localhost:3333/pdf.worker.min.mjs
   # Should return: HTTP/1.1 200 OK
   ```

3. Check browser console:
   - Open DevTools (F12)
   - Go to Network tab
   - Upload a PDF to Organize PDF tool
   - Look for `pdf.worker.min.mjs` - should be 200 OK

---

## Other Common Issues

### Port Already in Use

**Error:**
```
error: listen EADDRINUSE: address already in use :::3333
```

**Solution:**
```bash
# Find the process using port 3333
lsof -i :3333

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3334 bun dev
```

---

### Dependencies Not Installing

**Error:**
```
error: package not found
```

**Solution:**
```bash
# Clear Bun cache
rm -rf node_modules
rm -f bun.lockb

# Reinstall dependencies
bun install

# The postinstall script will automatically run
```

---

### Tailwind Styles Not Loading

**Symptoms:**
- App looks unstyled
- No colors or layout

**Solution:**
```bash
# Check that bunfig.toml has the plugin
cat bunfig.toml | grep tailwind

# Restart dev server with clean cache
rm -rf .bun
bun dev
```

---

### IndexedDB Quota Exceeded

**Error:**
```
QuotaExceededError: The quota has been exceeded
```

**Solution:**
```bash
# Open browser console and run:
# Clear all IndexedDB data:
indexedDB.deleteDatabase('pdf-tools-db');

# Or clear specific tasks:
# Go to Application tab > IndexedDB > pdf-tools-db
# Delete old tasks manually
```

---

### Build Fails in Docker

**Error:**
```
Error: Cannot find module
```

**Solution:**
```bash
# Make sure all files are committed
git status

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

---

### React Router 404 in Production

**Symptoms:**
- Routes work in dev but not in production
- Direct navigation to `/jpg-to-pdf` gives 404

**Solution:**
Update `nginx.conf` to handle client-side routing:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

This is already configured in the project.

---

## Debugging Tips

### Enable Verbose Logging

```typescript
// Add to src/index.ts
console.log('Environment:', process.env.NODE_ENV);
console.log('Server:', server.url);

// Add to components
console.log('Component mounted:', { props });
```

### Check Browser Console

1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check Application tab for IndexedDB/LocalStorage

### Check Server Logs

```bash
# Development
bun dev
# Watch for errors in terminal

# Docker
docker-compose logs -f pdf-tools
```

### Test PDF Processing

```typescript
// Add to component
console.log('File:', file);
console.log('File type:', file.type);
console.log('File size:', file.size);
```

---

## Need More Help?

### Check Documentation

- `README.md` - Project overview
- `ARCHITECTURE.md` - System design
- `START_HERE.md` - Quick start guide
- `MVP_COMPLETE.md` - Feature documentation

### Common Commands

```bash
# Development
bun install          # Install dependencies
bun dev             # Start dev server
bun run build       # Build for production
bun run setup:worker # Setup PDF.js worker

# Docker
make docker-build   # Build Docker image
make docker-up      # Start containers
make docker-down    # Stop containers
make docker-logs    # View logs

# Testing
curl http://localhost:3333/pdf.worker.min.mjs  # Test worker
curl http://localhost:3333/                     # Test app
```

---

## System Requirements

### Minimum
- Node.js 18+ or Bun 1.0+
- 2GB RAM
- 1GB free disk space
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)

### Recommended
- Bun 1.1+
- 4GB RAM
- 2GB free disk space
- Latest Chrome/Firefox/Safari

---

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| Opera | 76+ | ✅ Full support |
| Mobile Chrome | Latest | ✅ Full support |
| Mobile Safari | Latest | ✅ Full support |

---

## Performance Issues

### Large PDF Files

**Symptoms:**
- Slow thumbnail generation
- Browser becomes unresponsive
- Memory warnings

**Solution:**
- Files are limited to 100MB
- Reduce thumbnail scale in `pdfRenderer.ts`
- Process pages in smaller batches
- Consider using pagination for large PDFs

### Memory Leaks

**Prevention:**
- Task queue auto-cleans after 24 hours
- Blob URLs are revoked after use
- Canvas elements are cleaned up
- File references are released

---

## Security Considerations

### File Validation

All uploaded files are validated:
- File type checking (MIME type)
- File size limits (100MB)
- PDF structure validation
- No server upload (privacy-first)

### Content Security Policy

If adding CSP headers, make sure to allow:
- Blob URLs for file downloads
- Data URLs for thumbnails
- Worker scripts from same origin

---

## Updates and Maintenance

### Updating Dependencies

```bash
# Check for updates
bun outdated

# Update all dependencies
bun update

# Update specific package
bun update pdf-lib

# Don't forget to run setup after updating
bun run setup:worker
```

### Keeping Worker in Sync

The worker file is tied to the `pdfjs-dist` version. After updating:

```bash
# Update pdfjs-dist
bun update pdfjs-dist

# Recopy worker file
bun run setup:worker

# Restart dev server
bun dev
```

---

**Last Updated:** February 4, 2026  
**Version:** 1.0.0
