// A unique name for the cache
const CACHE_NAME = 'danmills-portfolio-cache-v6';

// The list of files to cache on service worker installation
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
  '/assets/js/particles-config.js',
  '/assets/images/logo.png',
  '/assets/images/danmillsheadshot.jpg',
  '/assets/images/stocktoolthumb.png',
  '/assets/images/ui-ux-thumbnail.png',
  '/assets/images/user-centric-design-loop.png',
  '/assets/images/wireframe-to-final-product.png',
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
      .then(() => {
        // Force the new service worker to activate immediately
        return self.skipWaiting();
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
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
  );
});


// Update the cache when a new service worker is activated
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Tell the active service worker to take control of the page immediately
      return self.clients.claim();
    })
  );
});

