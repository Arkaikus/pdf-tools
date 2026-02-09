// Base path utilities for runtime path resolution

/**
 * Get the base path for the application
 * Works with both root and subdirectory deployments
 */
export function getBasePath(): string {
  // Check if base tag exists (injected during build for subdirectory deployments)
  const baseTag = document.querySelector('base');
  if (baseTag && baseTag.href) {
    const url = new URL(baseTag.href);
    return url.pathname;
  }

  // Fallback: detect from current pathname
  const pathname = window.location.pathname;
  
  // Check if we're under a known subdirectory
  const pathParts = pathname.split('/').filter(Boolean);
  if (pathParts.length > 0 && pathParts[0] === 'pdf-tools') {
    return '/pdf-tools/';
  }

  // Default to root
  return '/';
}

/**
 * Resolve a path with the base path
 */
export function resolveAssetPath(path: string): string {
  const basePath = getBasePath();
  
  if (basePath === '/') {
    return path;
  }

  // Remove leading slash from path if present
  const cleanPath = path.replace(/^\//, '');
  
  // Combine base path with asset path
  return `${basePath}${cleanPath}`;
}

/**
 * Log base path information (for debugging)
 */
export function logBasePathInfo(): void {
  const basePath = getBasePath();
  const baseTag = document.querySelector('base');
  
  console.group('🔧 Base Path Configuration');
  console.log('Base path:', basePath);
  console.log('Base tag:', baseTag?.href || 'Not present');
  console.log('Current pathname:', window.location.pathname);
  console.log('Manifest path:', resolveAssetPath('manifest.json'));
  console.log('SW path:', resolveAssetPath('sw.js'));
  console.groupEnd();
}
