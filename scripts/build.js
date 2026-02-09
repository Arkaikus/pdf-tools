import tailwindPlugin from 'bun-plugin-tailwind';

// Configuration
const BASE_PATH = process.env.BASE_PATH || '/pdf-tools/';

console.log('🔨 Building PDF Tools...');
console.log(`📁 Base path: ${BASE_PATH}`);

// Build the app
await Bun.build({
  entrypoints: ['src/index.html'],
  outdir: 'dist',
  target: 'browser',
  minify: true,
  sourcemap: true,
  plugins: [tailwindPlugin],
});

console.log('✅ Build complete');

// Helper function to resolve asset path
function resolveAssetPath(assetPath) {
  if (BASE_PATH === '/') {
    return assetPath;
  }
  // Remove leading slash from asset path if present
  const cleanAsset = assetPath.replace(/^\//, '');
  return `${BASE_PATH}${cleanAsset}`;
}

// Process manifest.json with base path
console.log('📦 Processing manifest.json...');
try {
  const manifestPath = './public/manifest.json';
  const manifestFile = Bun.file(manifestPath);
  const manifestExists = await manifestFile.exists();
  
  if (!manifestExists) {
    console.error('❌ manifest.json not found');
    process.exit(1);
  }
  
  const manifestContent = await manifestFile.text();
  const manifest = JSON.parse(manifestContent);
  
  // Update paths in manifest
  manifest.start_url = BASE_PATH;
  manifest.scope = BASE_PATH;
  
  // Update icon paths
  if (manifest.icons) {
    manifest.icons = manifest.icons.map(icon => ({
      ...icon,
      src: resolveAssetPath(icon.src)
    }));
  }
  
  // Update screenshot paths if present
  if (manifest.screenshots) {
    manifest.screenshots = manifest.screenshots.map(screenshot => ({
      ...screenshot,
      src: resolveAssetPath(screenshot.src)
    }));
  }
  
  await Bun.write('./dist/manifest.json', JSON.stringify(manifest, null, 2));
  console.log('✅ Processed manifest.json');
} catch (error) {
  console.error('❌ Failed to process manifest.json:', error);
  process.exit(1);
}

// Process service worker with base path
console.log('📦 Processing service worker...');
try {
  const swPath = './public/sw.js';
  const swFile = Bun.file(swPath);
  const swExists = await swFile.exists();
  
  if (!swExists) {
    console.error('❌ sw.js not found');
    process.exit(1);
  }
  
  let swContent = await swFile.text();
  
  // Inject base path configuration at the top of the service worker
  const swConfig = `
// Service Worker Configuration (injected during build)
const BASE_PATH = '${BASE_PATH}';

// Helper to resolve paths with base path
function resolveUrl(url) {
  if (BASE_PATH === '/') return url;
  if (url === '/') return BASE_PATH.replace(/\\/$/, '') || '/';
  const cleanUrl = url.replace(/^\\//, '');
  return \`\${BASE_PATH}\${cleanUrl}\`;
}
`;
  
  // Update STATIC_ASSETS to use base path
  swContent = swContent.replace(
    /const STATIC_ASSETS = \[([\s\S]*?)\];/,
    (match, assets) => {
      const assetList = assets
        .split(',')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('//'))
        .map(line => {
          const path = line.replace(/['"]/g, '').trim();
          if (!path) return null;
          return `  '${resolveAssetPath(path)}'`;
        })
        .filter(Boolean)
        .join(',\n');
      
      return `const STATIC_ASSETS = [\n${assetList}\n];`;
    }
  );
  
  // Inject config at the beginning (after comments)
  const commentEnd = swContent.indexOf('\n\n');
  if (commentEnd !== -1) {
    swContent = swContent.slice(0, commentEnd) + '\n' + swConfig + swContent.slice(commentEnd);
  } else {
    swContent = swConfig + '\n' + swContent;
  }
  
  await Bun.write('./dist/sw.js', swContent);
  console.log('✅ Processed service worker');
} catch (error) {
  console.error('❌ Failed to process service worker:', error);
  process.exit(1);
}

// Process index.html with base path and inject PWA tags
console.log('📦 Processing index.html...');
try {
  const htmlPath = './dist/index.html';
  const htmlFile = Bun.file(htmlPath);
  const htmlExists = await htmlFile.exists();
  
  if (!htmlExists) {
    console.error('❌ index.html not found in dist/');
    process.exit(1);
  }
  
  let htmlContent = await htmlFile.text();
  
  // Build PWA meta tags and icons
  const manifestPath = resolveAssetPath('manifest.json');
  const iconSvgPath = resolveAssetPath('icon.svg');
  const icon192Path = resolveAssetPath('icon-192.png');
  const icon512Path = resolveAssetPath('icon-512.png');
  
  const pwaTags = `<!-- PWA Meta Tags -->
    <link rel="manifest" href="${manifestPath}" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="PDF Tools" />
    
    <!-- Icons -->
    <link rel="icon" type="image/svg+xml" href="${iconSvgPath}" />
    <link rel="icon" type="image/png" sizes="192x192" href="${icon192Path}" />
    <link rel="icon" type="image/png" sizes="512x512" href="${icon512Path}" />
    <link rel="apple-touch-icon" href="${icon192Path}" />`;
  
  // Inject PWA tags
  htmlContent = htmlContent.replace(
    /<!-- PWA tags and icons will be injected during build -->/,
    pwaTags
  );
  
  // Add base tag if not root path
  if (BASE_PATH !== '/') {
    const baseTag = `<base href="${BASE_PATH}">`;
    htmlContent = htmlContent.replace(
      /<head>/,
      `<head>\n    ${baseTag}`
    );
  }
  
  await Bun.write(htmlPath, htmlContent);
  console.log('✅ Processed index.html');
  console.log(`   - Manifest path: ${manifestPath}`);
  console.log(`   - Icon paths: ${icon192Path}, ${icon512Path}`);
  if (BASE_PATH !== '/') {
    console.log(`   - Base tag: ${BASE_PATH}`);
  }
} catch (error) {
  console.error('❌ Failed to process index.html:', error);
  process.exit(1);
}

// Copy remaining public assets
console.log('📦 Copying public assets...');

const assetsToCopy = [
  { src: './public/pdf.worker.min.mjs', dest: './dist/pdf.worker.min.mjs', required: true },
  { src: './public/icon.svg', dest: './dist/icon.svg', required: false },
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

// Create a build info file
const buildInfo = {
  basePath: BASE_PATH,
  buildTime: new Date().toISOString(),
  version: '1.0.0',
};

await Bun.write('./dist/build-info.json', JSON.stringify(buildInfo, null, 2));
console.log('✅ Created build-info.json');

console.log('\n✨ Build complete!');
console.log(`📁 Base path configured: ${BASE_PATH}`);
console.log('📝 Note: PWA icons are optional. Run "bun run generate:icons" to create them from SVG.');
console.log('\n🚀 Deploy the dist/ folder to your server');
