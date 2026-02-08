#!/bin/bash

# Script to generate PWA icons from SVG
# Requires: ImageMagick or inkscape

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PUBLIC_DIR="$PROJECT_ROOT/public"
ICON_SVG="$PUBLIC_DIR/icon.svg"

echo "🎨 Generating PWA icons..."

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "✓ Using ImageMagick"
    
    # Generate 192x192 icon
    convert -background none -density 300 -resize 192x192 "$ICON_SVG" "$PUBLIC_DIR/icon-192.png"
    echo "✓ Generated icon-192.png"
    
    # Generate 512x512 icon
    convert -background none -density 300 -resize 512x512 "$ICON_SVG" "$PUBLIC_DIR/icon-512.png"
    echo "✓ Generated icon-512.png"
    
    # Generate maskable icon (512x512 with safe zone)
    convert -background none -density 300 -resize 512x512 "$ICON_SVG" "$PUBLIC_DIR/icon-maskable.png"
    echo "✓ Generated icon-maskable.png"
    
elif command -v inkscape &> /dev/null; then
    echo "✓ Using Inkscape"
    
    # Generate 192x192 icon
    inkscape "$ICON_SVG" --export-type=png --export-filename="$PUBLIC_DIR/icon-192.png" --export-width=192 --export-height=192
    echo "✓ Generated icon-192.png"
    
    # Generate 512x512 icon
    inkscape "$ICON_SVG" --export-type=png --export-filename="$PUBLIC_DIR/icon-512.png" --export-width=512 --export-height=512
    echo "✓ Generated icon-512.png"
    
    # Generate maskable icon
    inkscape "$ICON_SVG" --export-type=png --export-filename="$PUBLIC_DIR/icon-maskable.png" --export-width=512 --export-height=512
    echo "✓ Generated icon-maskable.png"
    
else
    echo "❌ Error: Neither ImageMagick nor Inkscape is installed"
    echo ""
    echo "Please install one of the following:"
    echo "  • ImageMagick: https://imagemagick.org/script/download.php"
    echo "  • Inkscape: https://inkscape.org/release/"
    echo ""
    echo "Or manually convert $ICON_SVG to PNG files:"
    echo "  • icon-192.png (192x192)"
    echo "  • icon-512.png (512x512)"
    echo "  • icon-maskable.png (512x512)"
    exit 1
fi

# Generate favicon.ico (if ImageMagick is available)
if command -v convert &> /dev/null; then
    convert "$PUBLIC_DIR/icon-192.png" -define icon:auto-resize=64,48,32,16 "$PUBLIC_DIR/favicon.ico"
    echo "✓ Generated favicon.ico"
fi

echo ""
echo "✅ All icons generated successfully!"
echo ""
echo "Generated files:"
echo "  • $PUBLIC_DIR/icon-192.png"
echo "  • $PUBLIC_DIR/icon-512.png"
echo "  • $PUBLIC_DIR/icon-maskable.png"
if [ -f "$PUBLIC_DIR/favicon.ico" ]; then
    echo "  • $PUBLIC_DIR/favicon.ico"
fi
