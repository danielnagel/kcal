const cache_name = 'kcal-cache';
const urls_to_cache = [
    '/',
    '/input_kcal',
    '/input_weight',
    '/summary_kcal',
    '/summary_weight',
    '/index.js',
    '/input_kcal.js',
    '/input_weight.js',
    '/summary_kcal.js',
    '/summary_weight.js',
    '/chart.umd.js',
    '/tabulator.min.js',
    '/index.css',
    '/tabulator.min.css',
    '/favicon.ico',
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(cache_name).then((cache) => {
        return cache.addAll(urls_to_cache)
    }));
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
            .then((response) => {
                return response || fetch(e.request);
            })
    );
});