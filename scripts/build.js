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

// Copy PDF.js worker file to dist
console.log('📦 Copying PDF.js worker...');
const workerSource = './public/pdf.worker.min.mjs';
const workerDest = './dist/pdf.worker.min.mjs';

try {
  await Bun.write(workerDest, Bun.file(workerSource));
  console.log('✅ PDF.js worker copied to dist/');
} catch (error) {
  console.error('❌ Failed to copy PDF.js worker:', error);
  process.exit(1);
}