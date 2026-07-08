const CACHE_NAME = 'gold-calc-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'https://img.icons8.com/fluent/512/gold-bars.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
