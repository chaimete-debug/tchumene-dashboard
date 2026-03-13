const CACHE_NAME = 'tchumene-v4';
const STATIC_ASSETS = [
  '/manifest.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(c) {
      return c.addAll(STATIC_ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(k) { return k !== CACHE_NAME; })
          .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);
  var isExternal = url.origin !== self.location.origin;
  var isGoogleScript = url.hostname.includes('script.google.com') || url.hostname.includes('googleapis.com');

  if (isExternal || isGoogleScript) {
    return;
  }

  var isHtmlRequest =
    e.request.mode === 'navigate' ||
    (e.request.headers.get('accept') || '').includes('text/html');

  if (isHtmlRequest) {
    e.respondWith(
      fetch(e.request).catch(function() {
        return caches.match('/index.html');
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;

      return fetch(e.request).then(function(response) {
        if (response && response.ok && e.request.method === 'GET') {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      });
    })
  );
});