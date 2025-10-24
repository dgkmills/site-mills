// This is your service worker file.

const CACHE_NAME = 'danmills-portfolio-cache-v2'; // Incremented cache version
const urlsToCache = [
  '/',
  '/index.html',
  '/pages/about.html',
  '/pages/portfolio.html',
  '/pages/contact.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/images/logo.png',
  '/assets/images/danmillsheadshot.jpg',
  '/manifest.json',

  // Add new screenshot thumbnails to the cache
  '/assets/images/almanac-thumb.png',
  '/assets/images/dialogue-thumb.png',
  '/assets/images/email-assist-thumb.png',
  '/assets/images/mattsworld-thumb.png',
  '/assets/images/pronunciation-thumb.png',
  '/assets/images/stocktoolthumb.png',
  '/assets/images/tdanthumb.png',
  
  // PWA Icons
  '/assets/images/favicon.ico',
  '/assets/images/favicon-16x16.png',
  '/assetsExamples/images/favicon-32x32.png',
  '/assets/images/apple-touch-icon.png',
  '/assets/images/android-chrome-192x192.png',
  '/assets/images/android-chrome-512x512.png'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate service worker and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Delete old caches that are not the current one
          return cacheName.startsWith('danmills-portfolio-cache-') &&
                 cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Fetch event (cache-first strategy)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

