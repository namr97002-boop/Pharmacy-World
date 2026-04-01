// Service Worker لنظام الصيدلية - الدكتور بسام العامري
const CACHE_NAME = 'pharma-system-v1';
const urlsToCache = [
    './',
    './index.html',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// تثبيت Service Worker وتخزين الملفات
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('✅ تم فتح الكاش');
                return cache.addAll(urlsToCache);
            })
            .catch(function(error) {
                console.log('❌ فشل تخزين الملفات:', error);
            })
    );
    self.skipWaiting();
});

// استرجاع الملفات من الكاش عند عدم وجود إنترنت
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// تحديث الكاش عند تفعيل Service Worker جديد
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cache) {
                    if (cache !== CACHE_NAME) {
                        console.log('🗑️ حذف الكاش القديم:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});