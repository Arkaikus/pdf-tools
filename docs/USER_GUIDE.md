# PDF Tools - User Guide

Complete guide to using all PDF Tools features.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [JPG to PDF](#jpg-to-pdf)
3. [Merge PDF](#merge-pdf)
4. [Organize PDF](#organize-pdf)
5. [Task Queue](#task-queue)
6. [Tips & Tricks](#tips--tricks)

---

## Getting Started

### First Time Setup

1. **Access the Application**
   - Local: `http://localhost:3333`
   - Docker: `http://localhost:3333`

2. **Choose a Tool**
   - Click on any tool card from the homepage
   - Or use the navigation menu

3. **Privacy Notice**
   - All processing happens in your browser
   - No files are uploaded to any server
   - Results are stored locally for 24 hours

---

## JPG to PDF

Convert images to a single PDF document with customizable settings.

### How to Use

1. **Upload Images**
   - Click the upload zone or drag & drop images
   - Supports: JPG, JPEG, PNG, WebP, GIF
   - Multiple images can be selected at once
   - Max file size: 100MB total

2. **Reorder Images**
   - Drag and drop images to reorder
   - The order determines page order in the PDF
   - First image = first page

3. **Configure Settings**
   - **Page Size**: A4, Letter, or Legal
   - **Orientation**: Portrait or Landscape
   - **Margins**: Adjust space around images (0-50px)
   - **Fit**: Choose how images fit on pages
     - `Fit`: Scale to fit within margins
     - `Fill`: Scale to fill page (may crop)
     - `Stretch`: Stretch to fill (may distort)
   - **Aspect Ratio**: Maintain original proportions

4. **Create PDF**
   - Click "Create PDF" button
   - Task will be added to queue
   - Download automatically or from task queue

### Best Practices

- **Image Quality**: Use high-resolution images for better output
- **File Size**: Reduce large images before uploading
- **Consistency**: Use same orientation for all images
- **Order**: Arrange images before converting

### Common Issues

**Images appear rotated**
- Some cameras save rotation in metadata only
- Use an image editor to permanently rotate before upload

**PDF is too large**
- Compress images before upload
- Use JPG instead of PNG
- Lower image resolution

---

## Merge PDF

Combine multiple PDF files into a single document.

### How to Use

1. **Upload PDFs**
   - Click the upload zone or drag & drop PDFs
   - Multiple PDFs can be selected at once
   - Max file size: 100MB per file

2. **Reorder Files**
   - Drag and drop to change merge order
   - First file = first pages in output

3. **Select Page Ranges** (Optional)
   - Leave empty to include all pages
   - Examples:
     - `1-3` = pages 1, 2, 3
     - `1,3,5` = pages 1, 3, 5
     - `1-3,5,7-10` = pages 1, 2, 3, 5, 7, 8, 9, 10
     - `-` or `all` = all pages

4. **Merge PDFs**
   - Click "Merge PDFs" button
   - Task will be added to queue
   - Download automatically or from task queue

### Features

- **Page Count Display**: See total pages for each PDF
- **Selective Pages**: Choose specific pages from each file
- **Reordering**: Change file order before merging
- **Remove Files**: Remove unwanted files before merging

### Best Practices

- **Page Ranges**: Double-check page numbers before merging
- **Order**: Arrange files in desired output order
- **Consistency**: Use similar page sizes for best results

### Common Issues

**"Invalid page range" error**
- Check page numbers don't exceed document pages
- Use correct syntax: `1-3,5,7-10`
- Spaces don't matter: `1-3, 5, 7-10` works too

**Merged PDF has wrong order**
- Remember: File order determines page order
- Drag files to reorder before merging

---

## Organize PDF

Reorder, rotate, and delete pages in a PDF document.

### How to Use

1. **Upload PDF**
   - Click the upload zone or drag & drop a single PDF
   - Max file size: 100MB
   - Only one PDF at a time

2. **Wait for Thumbnails**
   - Thumbnails are generated for each page
   - Progress indicator shows generation status
   - Larger PDFs take longer

3. **Reorder Pages**
   - Drag and drop page thumbnails
   - New order is reflected immediately
   - Page numbers update automatically

4. **Rotate Pages**
   - Click left/right rotate buttons on thumbnails
   - Rotates in 90° increments
   - Visual preview updates immediately

5. **Delete Pages**
   - Click trash icon on page thumbnail
   - Page moves to "Deleted Pages" section
   - Deleted pages shown with overlay

6. **Restore Pages**
   - Deleted pages can be restored
   - Click restore icon in deleted section
   - Page returns to original position

7. **Save Changes**
   - Click "Save Organized PDF" button
   - Only active pages are included
   - Rotations and new order are applied
   - Task added to queue

### Features

- **Visual Preview**: See all pages as thumbnails
- **Drag & Drop**: Intuitive page reordering
- **Rotate**: ±90° rotation with preview
- **Soft Delete**: Delete pages with restore option
- **Page Count**: Track total, active, and deleted pages
- **Grip Handle**: Clear drag indicator

### Best Practices

- **Large PDFs**: Be patient with thumbnail generation
- **Review First**: Check all changes before saving
- **Use Restore**: Don't worry about accidental deletes
- **Order Carefully**: Use drag handles for precision

### Common Issues

**Thumbnails not loading**
- See [Troubleshooting Guide](TROUBLESHOOTING.md) - PDF.js Worker section
- Ensure PDF is not corrupted
- Try a smaller PDF first

**Drag not working**
- Use the grip handle (six dots) to drag
- Don't try to drag deleted pages
- Refresh if drag stops working

**Page rotates wrong**
- Each click rotates 90° clockwise/counterclockwise
- Multiple clicks for 180° rotation
- Visual preview shows current rotation

---

## Task Queue

Track all your PDF processing tasks and download results.

### Overview

The task queue automatically tracks:
- JPG to PDF conversions
- PDF merges
- PDF organization tasks

### Features

- **Unique Task IDs**: Each task gets a 5-character ID (e.g., "A3X9K")
- **Status Tracking**: See if tasks are processing, completed, or failed
- **Result Storage**: Results stored for 24 hours
- **Re-download**: Download results multiple times
- **Input Tracking**: See what files were used
- **Statistics**: Overview of all tasks

### How to Use

1. **Access Task Queue**
   - Click the queue icon in header
   - Badge shows number of tasks
   - Or navigate to `/tasks`

2. **View Tasks**
   - See all tasks with status
   - Completed tasks show green checkmark
   - Failed tasks show error details
   - Processing tasks show spinner

3. **Download Results**
   - Click "Download" button on completed tasks
   - Download multiple times if needed
   - Results available for 24 hours

4. **Clear Tasks**
   - Click "Clear" to remove individual tasks
   - Or "Clear All Completed" for bulk removal
   - Deleted tasks cannot be recovered

### Task Statuses

- **Processing**: Task is being created (brief)
- **Completed**: Task succeeded, result available
- **Failed**: Task failed, error message shown

### Statistics Dashboard

View at top of task queue page:
- **Total Tasks**: All tasks ever created
- **Processing**: Currently processing
- **Completed**: Successfully completed
- **Failed**: Failed with errors

### Auto-Cleanup

- Tasks are automatically deleted after 24 hours
- Includes both task metadata and result files
- Helps maintain privacy and free up storage
- You'll see a warning before deletion time

---

## Tips & Tricks

### General Tips

1. **File Size Limits**
   - Max 100MB per file
   - Browser may struggle with very large files
   - Consider splitting large PDFs

2. **Browser Performance**
   - Close other tabs for better performance
   - Modern browsers work best (Chrome, Firefox, Edge)
   - Mobile devices may be slower

3. **Privacy**
   - All processing is client-side
   - Safe to use with sensitive documents
   - No data leaves your device
   - Results auto-delete after 24h

4. **Offline Use**
   - Works offline after initial load
   - All features available without internet
   - Perfect for secure environments

### Keyboard Shortcuts

Currently no keyboard shortcuts implemented. Coming in future update!

### Mobile Usage

- All features work on mobile
- Drag & drop works with touch
- Pinch to zoom on thumbnails (where supported)
- Landscape mode recommended for better view

### Browser Compatibility

**Fully Supported:**
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

**Partially Supported:**
- Older browsers may have issues
- Some features require modern APIs

---

## Troubleshooting

For common issues and solutions, see the [Troubleshooting Guide](TROUBLESHOOTING.md).

### Quick Fixes

**App not loading**
- Clear browser cache
- Disable browser extensions
- Try incognito/private mode

**Features not working**
- Refresh the page
- Check browser console for errors
- Try a different browser

**Files not uploading**
- Check file size (max 100MB)
- Ensure file is not corrupted
- Try a smaller file first

---

## Getting Help

1. **Check Documentation**
   - [Troubleshooting Guide](TROUBLESHOOTING.md)
   - [Architecture](ARCHITECTURE.md)
   - [Installation Guide](INSTALL.md)

2. **Review Code**
   - Project is open source
   - Check GitHub repository
   - See implementation details

3. **Report Issues**
   - Include browser version
   - Describe steps to reproduce
   - Share error messages if any

---

**Last Updated:** February 4, 2026  
**Version:** 1.0.0  
**For:** PDF Tools MVP
