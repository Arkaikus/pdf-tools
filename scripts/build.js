import tailwindPlugin from 'bun-plugin-tailwind';

console.log('🔨 Building PDF Tools...');

await Bun.build({
  entrypoints: ['src/index.html'],
  outdir: 'dist',
  target: 'browser',
  minify: true,
  sourcemap: true,
  plugins: [tailwindPlugin],
});

console.log('✅ Build complete');

// Copy public assets to dist
console.log('📦 Copying public assets...');

const assetsToCopy = [
  { src: './public/pdf.worker.min.mjs', dest: './dist/pdf.worker.min.mjs', required: true },
  { src: './public/manifest.json', dest: './dist/manifest.json', required: true },
  { src: './public/sw.js', dest: './dist/sw.js', required: true },
  { src: './public/icon-192.png', dest: './dist/icon-192.png', required: false },
  { src: './public/icon-512.png', dest: './dist/icon-512.png', required: false },
  { src: './public/icon-maskable.png', dest: './dist/icon-maskable.png', required: false },
  { src: './public/favicon.ico', dest: './dist/favicon.ico', required: false },
];

for (const asset of assetsToCopy) {
  try {
    const sourceFile = Bun.file(asset.src);
    const exists = await sourceFile.exists();
    
    if (!exists) {
      if (asset.required) {
        console.error(`❌ ${asset.src} not found`);
        if (asset.src.includes('pdf.worker')) {
          console.error('   Run "bun run setup:worker" first');
        }
        process.exit(1);
      } else {
        console.warn(`⚠️  ${asset.src} not found (optional)`);
        continue;
      }
    }
    
    await Bun.write(asset.dest, sourceFile);
    console.log(`✅ Copied ${asset.src.replace('./public/', '')}`);
  } catch (error) {
    if (asset.required) {
      console.error(`❌ Failed to copy ${asset.src}:`, error);
      process.exit(1);
    } else {
      console.warn(`⚠️  Failed to copy ${asset.src} (optional)`);
    }
  }
}

console.log('\n✨ Build complete!');
console.log('\nNote: PWA icons are optional. Run "bun run generate:icons" to create them from SVG.');