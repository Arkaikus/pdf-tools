#!/bin/bash
# Setup script for PDF.js worker file

echo "🔧 Setting up PDF.js worker..."

# Create public directory if it doesn't exist
mkdir -p public

# Copy worker file from node_modules
if [ -f "node_modules/pdfjs-dist/build/pdf.worker.min.mjs" ]; then
  cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.min.mjs
  echo "✅ PDF.js worker copied to public/pdf.worker.min.mjs"
else
  echo "❌ Error: PDF.js worker not found in node_modules"
  echo "   Run 'bun install' first"
  exit 1
fi

# Make sure it's readable
chmod 644 public/pdf.worker.min.mjs

echo "✅ PDF.js worker setup complete!"
