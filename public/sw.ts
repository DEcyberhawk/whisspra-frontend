
const CACHE_NAME = 'whisspra-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // If the network fails, try to serve from the cache.
      return caches.match(event.request);
    })
  );
});
