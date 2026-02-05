# Troubleshooting Guide

Common issues and solutions for PDF Tools.

---

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [PDF.js Worker Errors](#pdfjs-worker-errors)
3. [Runtime Errors](#runtime-errors)
4. [Docker Issues](#docker-issues)
5. [Browser Issues](#browser-issues)
6. [Performance Issues](#performance-issues)

---

## Installation Issues

### Bun Not Found

**Error:** `bun: command not found`

**Solution:**
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Reload shell or add to PATH
export PATH="$HOME/.bun/bin:$PATH"

# Verify
bun --version
```

### Dependencies Won't Install

**Error:** Package installation fails

**Solutions:**
```bash
# Clear cache and retry
rm -rf node_modules bun.lockb
bun install

# Check Bun version (needs 1.1+)
bun --version

# Update Bun if needed
curl -fsSL https://bun.sh/install | bash
```

### Permission Denied

**Error:** `EACCES: permission denied`

**Solutions:**
```bash
# Fix ownership
sudo chown -R $USER:$USER /home/arkaikus/Docker/pdf-tools

# Or run with sudo (not recommended)
sudo bun install
```

---

## PDF.js Worker Errors

### Failed to Fetch Worker Module

**Error:**
```
Uncaught TypeError: Failed to fetch dynamically imported module: 
http://cdnjs.cloudflare.com/ajax/libs/pdf.js/X.X.X/pdf.worker.min.js
```

**Root Cause:** PDF.js worker not set up correctly

**Solution:**
```bash
# Run worker setup script
bun run setup:worker

# Verify file exists
ls -la public/pdf.worker.min.mjs

# Should show: -rwxrwxrwx ... pdf.worker.min.mjs (1.4M)

# Restart dev server
bun dev
```

### Worker File Not Found

**Error:** `GET http://localhost:3333/pdf.worker.min.mjs 404 (Not Found)`

**Solution:**
```bash
# Worker setup script should run on install
# But you can run it manually:
bun run setup:worker

# Check if public directory exists
ls -la public/

# Restart server
bun dev
```

### Worker Still Fails After Setup

**Possible Causes:**
1. Browser cache issue
2. Server not serving the file
3. CORS issue (shouldn't happen with local file)

**Solutions:**
```bash
# 1. Hard refresh browser
# Chrome/Firefox: Ctrl+Shift+R
# Safari: Cmd+Shift+R

# 2. Check server is serving the file
curl -I http://localhost:3333/pdf.worker.min.mjs
# Should return: HTTP/1.1 200 OK

# 3. Check file permissions
chmod 644 public/pdf.worker.min.mjs

# 4. Clear browser cache
# DevTools → Network → Disable cache (checkbox)
```

---

## Runtime Errors

### Port Already in Use

**Error:** `error: listen EADDRINUSE: address already in use :::3333`

**Solution:**
```bash
# Find process using port 3333
lsof -i :3333

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3334 bun dev
```

### Module Not Found

**Error:** `Cannot find module 'react-router-dom'`

**Solution:**
```bash
# Reinstall dependencies
bun install

# If still failing, check package.json
cat package.json | grep react-router-dom

# Manually install if missing
bun add react-router-dom
```

### TypeScript Errors

**Error:** Type errors in console

**Solutions:**
```bash
# Check tsconfig.json exists
cat tsconfig.json

# Restart TS server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"

# Clear Bun cache
rm -rf .bun
bun dev
```

---

## Docker Issues

### Build Fails

**Error:** Docker build fails

**Solutions:**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check Docker version
docker --version  # Needs 20.10+
docker-compose --version  # Needs 2.0+
```

### Container Won't Start

**Error:** Container exits immediately

**Solutions:**
```bash
# View logs
docker-compose logs pdf-tools

# Check for port conflicts
lsof -i :3000

# Restart Docker daemon
sudo systemctl restart docker  # Linux
# Or restart Docker Desktop
```

### Can't Access App in Browser

**Problem:** `http://localhost:3000` doesn't work

**Solutions:**
```bash
# Check container is running
docker-compose ps

# Check port mapping
docker port pdf-tools

# Test nginx is responding
curl http://localhost:3000

# Check firewall
sudo ufw status  # Linux
```

### Files Not Updating in Container

**Problem:** Code changes don't appear

**Solution:**
```bash
# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Browser Issues

### App Doesn't Load

**Problem:** Blank page or loading forever

**Solutions:**
1. **Hard refresh:** Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. **Check browser console:** F12 → Console tab → Look for errors
3. **Clear cache:** Browser settings → Clear browsing data
4. **Try incognito/private mode**
5. **Try different browser**

### Features Not Working

**Problem:** Upload, drag-drop, or buttons don't work

**Solutions:**
1. **Check console for errors:** F12 → Console
2. **Verify JavaScript is enabled:** Browser settings
3. **Disable browser extensions:** Try incognito mode
4. **Update browser:** Needs Chrome 90+, Firefox 88+, Safari 14+

### Styles Look Broken

**Problem:** No styling or broken layout

**Solutions:**
```bash
# Check Tailwind is working
# Look for <style> tag in page source

# Restart dev server
bun dev

# Check bunfig.toml has plugin
cat bunfig.toml | grep tailwind

# Should show: plugins = ["bun-plugin-tailwind"]

# Clear .bun cache
rm -rf .bun
bun dev
```

---

## Performance Issues

### App is Slow

**Possible Causes:**
- Large PDF files (>50MB)
- Many pages (>100 pages)
- Low-end device
- Browser extensions

**Solutions:**
1. **Use smaller PDFs:** Split large PDFs first
2. **Close other tabs:** Free up memory
3. **Disable browser extensions:** Try incognito mode
4. **Use modern browser:** Chrome/Firefox recommended
5. **Check system resources:** Task Manager / Activity Monitor

### Thumbnails Take Forever

**Problem:** Organize PDF thumbnail generation is slow

**Expected Behavior:**
- Small PDFs (<10 pages): < 5 seconds
- Medium PDFs (10-50 pages): 5-30 seconds
- Large PDFs (50-100 pages): 30-60 seconds

**Solutions:**
1. **Be patient:** Large PDFs take time
2. **Check progress indicator:** Shows current page / total
3. **Don't upload huge PDFs:** 100+ pages will be very slow
4. **Close other apps:** Free up CPU

### Browser Crashes

**Problem:** Browser tab crashes or freezes

**Causes:**
- Very large PDF (>100MB)
- Too many pages
- Low memory

**Solutions:**
1. **Reduce file size:** Use smaller PDFs
2. **Close other tabs:** Free up memory
3. **Restart browser**
4. **Use desktop browser:** Better than mobile

---

## File Issues

### File Won't Upload

**Problem:** File upload fails or nothing happens

**Checks:**
1. **File type:** Must be PDF for most tools, or images (JPG/PNG) for JPG to PDF
2. **File size:** Max 100MB per file
3. **File is not corrupted:** Try opening in another app first
4. **Disk space:** Check browser has storage available

### Can't Download Result

**Problem:** Download button doesn't work

**Solutions:**
1. **Check browser download settings**
2. **Allow downloads from localhost** (browser security setting)
3. **Check disk space:** Ensure you have enough space
4. **Try different browser**
5. **Check task queue:** Result should be there

### Task Queue is Empty

**Problem:** Task disappeared or not showing

**Possible Causes:**
1. **Auto-cleanup:** Tasks deleted after 24 hours
2. **Browser data cleared:** IndexedDB cleared
3. **Different browser:** IndexedDB is per-browser
4. **Incognito mode:** No persistence

**Solutions:**
- Tasks are temporary (24h retention)
- Download immediately after processing
- Can't recover deleted tasks

---

## IndexedDB Issues

### Quota Exceeded Error

**Error:** `QuotaExceededError: The quota has been exceeded`

**Cause:** Browser storage limit reached (usually ~50-100MB)

**Solutions:**
```javascript
// Open browser console (F12) and run:
indexedDB.deleteDatabase('pdf-tools-db');

// Or clear tasks via UI:
// Go to /tasks → Clear All Completed
```

### Can't Access IndexedDB

**Problem:** Task queue not working

**Solutions:**
1. **Check browser support:** Modern browser required
2. **Enable cookies:** Some browsers tie IndexedDB to cookies
3. **Check incognito mode:** May have restricted storage
4. **Clear site data:** Browser settings → Clear site data

---

## Network Issues

### Can't Load App

**Problem:** Page won't load

**Checks:**
1. **Server is running:** `bun dev` in terminal
2. **Correct port:** http://localhost:3333 (dev) or :3000 (Docker)
3. **Firewall:** Not blocking local connections
4. **VPN:** Try disabling VPN

---

## Development Issues

### Hot Reload Not Working

**Problem:** Changes don't appear without manual refresh

**Solutions:**
```bash
# Restart with clean cache
rm -rf .bun
bun dev

# Check if --hot flag is in script
cat package.json | grep "dev"
# Should show: "bun --hot src/index.ts"
```

### TypeScript Errors in IDE

**Problem:** Red squiggles everywhere

**Solutions:**
1. **Restart TypeScript server:** VS Code → Cmd+Shift+P → "Restart TS Server"
2. **Check tsconfig.json:** Should exist in project root
3. **Install @types packages:** `bun install`
4. **Check IDE TypeScript version:** Should use workspace version

---

## Error Messages Reference

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `bun: command not found` | Bun not installed | Install Bun |
| `EADDRINUSE :3333` | Port in use | Kill process or use different port |
| `Failed to fetch...worker` | PDF.js worker not setup | Run `bun run setup:worker` |
| `QuotaExceededError` | IndexedDB full | Clear old tasks |
| `File type not supported` | Wrong file type | Use PDF or images (JPG/PNG) |
| `File too large` | File > 100MB | Use smaller file |

---

## Getting More Help

### Debug Steps

1. **Check browser console:** F12 → Console tab
2. **Check server logs:** Terminal running `bun dev`
3. **Check network tab:** F12 → Network → Look for failed requests
4. **Try incognito mode:** Rules out extensions/cache issues
5. **Try different browser:** Rules out browser-specific issues

### Gathering Info for Bug Reports

Include:
- **Browser:** Name and version (e.g., Chrome 120)
- **OS:** Operating system and version
- **Error message:** Full error from console
- **Steps to reproduce:** What you did before the error
- **File details:** Size and type of file used
- **Screenshots:** If relevant

### Documentation

- **[USER_GUIDE.md](USER_GUIDE.md)** - How to use features
- **[INSTALL.md](INSTALL.md)** - Installation guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical details

---

## Prevention Tips

### Best Practices

1. **Use recommended browsers:** Chrome 90+, Firefox 88+, Safari 14+
2. **Keep files reasonable:** < 50MB for best performance
3. **Download results immediately:** Tasks expire after 24 hours
4. **Close other tabs:** Free up memory for large PDFs
5. **Update regularly:** Keep Bun and dependencies updated

### System Requirements

**Minimum:**
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- 2GB RAM
- 1GB free disk space

**Recommended:**
- Latest browser version
- 4GB+ RAM
- 2GB+ free disk space
- Desktop/laptop (better than mobile for large files)

---

**Last Updated:** February 4, 2026  
**Version:** 1.0.0  
**For:** PDF Tools MVP
