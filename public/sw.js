const CACHE_NAME = 'divyamilan-pwa-v1';
const STATIC_ASSETS = [
  '/',
  '/icon/icon-192x192.png',
  '/icon/icon-512x512.png',
  '/manifest.json'
];

// Install Event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Stale-while-revalidate for static assets, bypass Firebase/Firestore/APIs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass Firebase, Firestore, Google APIs, and external API requests (Network Only)
  if (
    url.hostname.includes('firebase') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('google.com') ||
    url.pathname.includes('/api/') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  // Stale-While-Revalidate strategy for static assets and page requests
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          if (event.request.mode === 'navigate') {
            return cache.match('/');
          }
        });

        return cachedResponse || fetchPromise;
      });
    })
  );
});
