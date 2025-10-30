// This is your service worker file.

const CACHE_NAME = 'danmills-portfolio-cache-v4'; // Incremented cache version
const urlsToCache = [
  '/',
  '/index.html',
  '/pages/about.html',
  '/pages/portfolio.html',
  '/pages/contact.html',
  '/blog/blog.html',
  '/blog/obsidian-mind-map.html',
  '/blog/ui-ux-deep-dive.html',
  '/blog/Say-Goodbye-to-Hosting-Fees.html',
  '/blog/building-better-websites.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/images/logo.png',
  '/assets/images/danmillsheadshot.jpg',
  '/manifest.json',

  // Project Detail Pages
  '/pages/project-dr-kha.html',
  '/pages/project-almanac.html',
  '/pages/project-email-assist.html',
  '/pages/project-stock-tool.html',
  '/pages/project-teacher-dan.html',
  '/pages/project-portal.html', // ADDED
  '/pages/project-aree.html', // ADDED
  '/pages/project-matts-world.html',
  '/pages/project-dialogue-tool.html',
  '/pages/project-pronunciation-tool.html',
  
  // Thumbnails
  '/assets/images/drkhathumb.png',
  '/assets/images/almanac-thumb.png',
  '/assetsUnleashed-dialogue-thumb.png',
  '/assets/images/email-assist-thumb.png',
  '/assets/images/mattsworld-thumb.png',
  '/assets/images/pronunciation-thumb.png',
  '/assets/images/stocktoolthumb.png',
  '/assets/images/tdanthumb.png',
  '/assets/images/portalthumb.png', // ADDED
  '/assets/images/areethumb.png', // ADDED
  
  // Blog Images
  '/assets/images/obsidian-mindmap-tasks.png', // Corrected path
  '/assets/images/obsidian-mindmap-websites.png', // Corrected path
  '/assets/images/obsidian-mindmap-personal.jpg', // Corrected path
  '/assets/images/ui-ux-thumbnail.png',
  '/assets/images/serverlessway.png', // Corrected path
  '/assets/images/workflowdiagram.png',

  
  // PWA Icons
  '/assets/images/favicon.ico',
  '/assets/images/favicon-16x16.png',
  '/assets/images/favicon-32x32.png',
  '/assets/images/apple-touch-icon.png',
  '/assets/images/android-chrome-192x1M92.png',
  '/assets/images/android-chrome-512x512.png'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use addAll with error handling
        return cache.addAll(urlsToCache).catch(err => {
            console.error('Failed to cache URLs during install:', err);
            // Log which URL failed
            urlsToCache.forEach(url => {
                fetch(url).catch(() => console.error('Failed to fetch:', url));
            });
        });
      })
  );
  self.skipWaiting(); // Force activation
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
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim()) // Claim clients immediately
  );
});

// Fetch event (cache-first strategy)
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Parse the URL
  const requestUrl = new URL(event.request.url);

  // Use a Network First strategy for HTML files to get updates quickly
  if (requestUrl.pathname.endsWith('/') || requestUrl.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Check for a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // Network failed, try to get it from the cache
          return caches.match(event.request)
            .then(response => {
              return response || caches.match('/index.html'); // Fallback to cache
            });
        })
    );
    return; // End execution for HTML
  }

  // Use Cache First strategy for all other assets (CSS, JS, images)
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

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(err => {
            console.error('Fetch failed for asset:', event.request.url, err);
            // You could return a placeholder image here if it's an image request
        });
      })
  );
});

