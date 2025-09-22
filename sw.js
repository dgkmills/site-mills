// This file replaces the old 'pwa-service-worker.js'
// It should be placed in the root directory of your project.

const CACHE_NAME = 'sitemills-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/pages/about.html',
    '/pages/portfolio.html',
    '/pages/contact.html',
    '/blog/blog.html',
    '/blog/building-better-websites.html',
    '/assets/css/style.css',
    '/assets/js/manifest.json',
    '/assets/images/logo.png',
    '/assets/images/favicon.ico',
    '/assets/images/android-chrome-192x192.png',
    '/assets/images/android-chrome-512x512.png',
    '/assets/images/kmuttpagescreenshot.png',
    '/assets/images/newsitetopscreenshot.png',
    '/assets/images/researchgeneratorscreenshot.png'
];

// Install the service worker and cache the static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // If not in cache, fetch from the network
                return fetch(event.request);
            })
    );
});
