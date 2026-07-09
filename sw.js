// sw.js - Service Worker برای PWA (با پشتیبانی از مسیرهای نسبی)
const CACHE_NAME = 'gold-calc-v1';
const urlsToCache = [
    '.',               // index.html را بارگذاری می‌کند
    'manifest.json'
];

// نصب و کش کردن فایل‌ها
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 کش کردن فایل‌ها...');
                return cache.addAll(urlsToCache);
            })
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
                        console.log('🗑️ حذف کش قدیمی:', cache);
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
            .then((response) => {
                // اگر در کش پیدا شد، همان را برگردان
                if (response) {
                    return response;
                }
                // در غیر این صورت از شبکه درخواست کن
                return fetch(event.request)
                    .then((networkResponse) => {
                        // پاسخ را در کش ذخیره کن (برای دفعات بعد)
                        return caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, networkResponse.clone());
                                return networkResponse;
                            });
                    })
                    .catch(() => {
                        // اگر اینترنت قطع بود، یک پیام آفلاین نشان بده
                        return new Response('⚠️ اتصال اینترنت برقرار نیست.', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});
