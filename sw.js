// A unique name for the cache
const CACHE_NAME = 'danmills-portfolio-cache-v2';

// The list of files to cache on service worker installation
// I've removed the paths that were causing errors (missing files)
const urlsToCache = [
  '/',
  '/index.html',
  '/pages/about.html',
  '/pages/portfolio.html',
  '/pages/contact.html',
  '/blog/blog.html',
  '/blog/ui-ux-deep-dive.html',
  '/blog/Say-Goodbye-to-Hosting-Fees.html',
  '/blog/building-better-websites.html',
  '/assets/css/style.css',
  // This file is loaded from a CDN, so we don't need to pre-cache it from a local path
  // '/assets/js/particles.min.js', 
  '/assets/js/particles-config.js',
  '/assets/images/logo.png',
  '/assets/images/danmillsheadshot.jpg',
  // The following two SVG files were causing errors as they were either missing or empty.
  // '/assets/images/ui-ux-thumbnail.svg',
  // '/assets/images/stock-tool-thumbnail.svg',
  // Caching third-party resources is a good practice for performance
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'
];

// Install the service worker and cache the static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching assets');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache assets during install:', error);
      })
  );
});

// Serve cached content when offline, and update cache with new requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // If the resource is in the cache, return it
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch the resource from the network
        return fetch(event.request).then(networkResponse => {
          // Clone the response because it's a one-time use stream
          const responseToCache = networkResponse.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              // Cache the new resource for future use
              cache.put(event.request, responseToCache);
            });

          return networkResponse;
        });
      })
  );
});


// Update the cache when a new service worker is activated
self.addEventListener('activate', event => {
  // A list of caches to keep. We only want the newest one.
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If a cache is not in our whitelist, delete it
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
