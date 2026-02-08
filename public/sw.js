// Service Worker for PDF Tools
// Version: 1.0.0

const VERSION = 'v1.0.0';
const CACHE_NAME = `pdf-tools-${VERSION}`;

// Cache names for different types
const CACHES = {
  static: `${CACHE_NAME}-static`,
  runtime: `${CACHE_NAME}-runtime`,
  dynamic: `${CACHE_NAME}-dynamic`,
};

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/pdf.worker.min.mjs',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...', VERSION);
  
  event.waitUntil(
    caches.open(CACHES.static)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...', VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Remove old caches
              return cacheName.startsWith('pdf-tools-') && 
                     !Object.values(CACHES).includes(cacheName);
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip chrome-extension and other non-http(s) schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(handleFetch(request));
});

/**
 * Handle fetch request with appropriate caching strategy
 */
async function handleFetch(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    // Strategy 1: Network First for HTML (always get latest)
    if (pathname.endsWith('.html') || pathname === '/') {
      return await networkFirst(request, CACHES.static);
    }

    // Strategy 2: Cache First for static assets
    if (
      pathname.match(/\.(js|css|woff2?|ttf|eot|svg|ico|png|jpg|jpeg|gif|webp)$/) ||
      pathname.includes('pdf.worker')
    ) {
      return await cacheFirst(request, CACHES.runtime);
    }

    // Strategy 3: Network Only for API calls (if added later)
    if (pathname.startsWith('/api/')) {
      return await fetch(request);
    }

    // Default: Network First
    return await networkFirst(request, CACHES.dynamic);
    
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    
    // Return offline fallback if available
    return await getOfflineFallback(request);
  }
}

/**
 * Network First strategy
 * Try network, fallback to cache, update cache with network response
 */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Serving from cache (offline):', request.url);
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * Cache First strategy
 * Try cache, fallback to network, update cache with network response
 */
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log('[SW] Serving from cache:', request.url);
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Network and cache miss:', request.url);
    throw error;
  }
}

/**
 * Stale While Revalidate strategy
 * Return cache immediately, update cache in background
 */
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const cache = caches.open(cacheName);
        cache.then((c) => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => {
      // Network failed, but we might have cache
      return cachedResponse;
    });
  
  // Return cached response immediately if available
  return cachedResponse || fetchPromise;
}

/**
 * Get offline fallback page
 */
async function getOfflineFallback(request) {
  // For HTML requests, return the cached index.html
  if (request.destination === 'document') {
    const cachedIndex = await caches.match('/index.html');
    if (cachedIndex) {
      return cachedIndex;
    }
  }
  
  // For other requests, return 404-like response
  return new Response('Offline - Resource not available', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: new Headers({
      'Content-Type': 'text/plain',
    }),
  });
}

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: VERSION });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[SW] Clearing all caches');
    event.waitUntil(
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        })
        .then(() => {
          console.log('[SW] All caches cleared');
          event.ports[0].postMessage({ success: true });
        })
    );
  }
});

// Log service worker errors
self.addEventListener('error', (event) => {
  console.error('[SW] Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled rejection:', event.reason);
});

console.log('[SW] Service worker loaded', VERSION);
