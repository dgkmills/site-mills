// This file replaces the old 'pwa-service-worker.js'
// It should be placed in the root directory of your project.

const CACHE_NAME = 'sitemills-cache-v3'; // Keep the version the same for now
const urlsToCache = [
    '/',
    '/index.html',
    '/pages/about.html',
    '/pages/portfolio.html',
    '/pages/contact.html',
    '/pages/thank-you.html',
    '/blog/blog.html',
    '/blog/building-better-websites.html',
    '/blog/Say-Goodbye-to-Hosting-Fees.html',
    '/assets/css/style.css',
    '/assets/js/manifest.json',
    '/assets/images/logo.png',
    '/assets/images/favicon.ico',
    '/assets/images/android-chrome-192x192.png',
    '/assets/images/android-chrome-512x512.png',
    '/assets/images/kmuttpagescreenshot.png',
    '/assets/images/newsitetopscreenshot.png',
    '/assets/images/researchgeneratorscreenshot.png',
    '/assets/videos/pronunciationappintro.mp4'
];

// Install the service worker and cache the static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and caching files');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting()) // Force activation of the new service worker
    );
});

// Clean up old caches on activation
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Take control of open clients
    );
});


// Robust Fetch Handler: Network falling back to cache
self.addEventListener('fetch', event => {
    // We only want to handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // If we get a valid response from the network, cache it and return it
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                }
                return networkResponse;
            })
            .catch(() => {
                // If the network request fails (i.e., we're offline),
                // try to serve the response from the cache.
                console.log('Network request failed. Trying cache for:', event.request.url);
                return caches.match(event.request);
            })
    );
});

