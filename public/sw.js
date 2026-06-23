const CACHE_NAME = 'resurrected-labz-v2';
const urlsToCache = [
  '/',
  '/admin',
  '/portal',
  '/manifest.json'
];

const shouldCacheRequest = (request, response) => {
  if (request.method !== 'GET' || response.status !== 200) return false;

  const url = new URL(request.url);

  // Never cache CDN-hosted Lovable Assets. If an image request gets a temporary
  // HTML fallback response, caching it breaks product label images until the
  // browser cache is manually cleared.
  if (url.pathname.startsWith('/__l5e/assets-v1/')) return false;

  return true;
};

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache install failed:', error);
      })
  );
  self.skipWaiting();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseClone = response.clone();
        
        // Only cache safe app-shell requests
        if (shouldCacheRequest(event.request, response)) {
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request);
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
