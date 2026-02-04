import tailwindPlugin from 'bun-plugin-tailwind';

await Bun.build({
  entrypoints: ['src/index.html'],
  outdir: 'dist',
  target: 'browser',
  minify: true,
  sourcemap: true,
  plugins: [tailwindPlugin],
});