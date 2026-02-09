// Service Worker Registration Utility

export interface ServiceWorkerUpdateHandler {
  onUpdateAvailable?: (registration: ServiceWorkerRegistration) => void;
  onUpdateInstalled?: () => void;
  onOfflineReady?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Check if running in development mode
 */
function isDevelopment(): boolean {
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // Development indicators
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    port === '3333' || // Bun dev server default port
    hostname.startsWith('192.168.') || // Local network
    hostname.endsWith('.local') // mDNS
  );
}

/**
 * Register service worker
 */
export async function registerServiceWorker(
  handlers: ServiceWorkerUpdateHandler = {}
): Promise<ServiceWorkerRegistration | null> {
  // Only register in production and if service workers are supported
  if (isDevelopment()) {
    console.log('[SW] Service worker registration skipped in development');
    console.log('[SW] Current hostname:', window.location.hostname);
    return null;
  }

  if (!('serviceWorker' in navigator)) {
    console.warn('[SW] Service workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[SW] Service worker registered successfully');

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (!newWorker) {
        return;
      }

      console.log('[SW] Update found, installing new service worker...');

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New service worker available
            console.log('[SW] New version available');
            handlers.onUpdateAvailable?.(registration);
          } else {
            // First time install
            console.log('[SW] Offline ready');
            handlers.onOfflineReady?.();
          }
        }

        if (newWorker.state === 'activated') {
          console.log('[SW] New service worker activated');
          handlers.onUpdateInstalled?.();
        }
      });
    });

    // Check for updates periodically (every 1 hour)
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);

    return registration;
  } catch (error) {
    console.error('[SW] Service worker registration failed:', error);
    handlers.onError?.(error as Error);
    return null;
  }
}

/**
 * Unregister all service workers
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    const results = await Promise.all(
      registrations.map((registration) => registration.unregister())
    );

    console.log('[SW] Service workers unregistered');
    return results.every((result) => result === true);
  } catch (error) {
    console.error('[SW] Failed to unregister service workers:', error);
    return false;
  }
}

/**
 * Skip waiting and activate new service worker immediately
 */
export function skipWaiting(registration: ServiceWorkerRegistration): void {
  const waiting = registration.waiting;
  
  if (!waiting) {
    return;
  }

  waiting.postMessage({ type: 'SKIP_WAITING' });
  
  // Reload page when new service worker is activated
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

/**
 * Get current service worker version
 */
export async function getServiceWorkerVersion(): Promise<string | null> {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return null;
  }

  const controller = navigator.serviceWorker.controller;

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data.version || null);
    };

    controller.postMessage(
      { type: 'GET_VERSION' },
      [messageChannel.port2]
    );

    // Timeout after 1 second
    setTimeout(() => resolve(null), 1000);
  });
}

/**
 * Clear all service worker caches
 */
export async function clearServiceWorkerCaches(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return false;
  }

  const controller = navigator.serviceWorker.controller;

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data.success || false);
    };

    controller.postMessage(
      { type: 'CLEAR_CACHE' },
      [messageChannel.port2]
    );

    // Timeout after 5 seconds
    setTimeout(() => resolve(false), 5000);
  });
}

/**
 * Check if app is running in standalone mode (installed PWA)
 */
export function isStandalone(): boolean {
  // Check if running as PWA
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Check if browser supports service workers
 */
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}
