const CACHE_NAME = 'link-page-v1';
const urlsToCache = [
    '/experiment/',
    '/experiment/index.html',
    '/experiment/app.js',
    '/experiment/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
