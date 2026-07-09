// sw.js - Service Worker برای PWA
const CACHE_NAME = 'gold-calc-v1';
const urlsToCache = [
    'index.html',
    'manifest.json'
];

// نصب و کش کردن فایل‌ها
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// فعال‌سازی و پاک‌سازی کش قدیمی
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// استراتژی: ابتدا از کش، سپس درخواست به شبکه (با fallback)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
            .catch(() => {
                return new Response('صفحه مورد نظر در دسترس نیست.', {
                    status: 404,
                    statusText: 'Not Found'
                });
            })
    );
});
