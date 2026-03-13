const CACHE_NAME = 'tchumene-v3';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(c) {
      return c.addAll(ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  // Never intercept Google Apps Script or external API calls — let Chrome handle them directly
  var url = new URL(e.request.url);
  var isExternal = url.origin !== self.location.origin;
  var isGoogleScript = url.hostname.includes('script.google.com') || url.hostname.includes('googleapis.com');

  if (isExternal || isGoogleScript) {
    // Don't intercept — pass through to network
    return;
  }

  // For same-origin requests: cache-first with network fallback
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(r) {
        if (r && r.ok && e.request.method === 'GET') {
          var cl = r.clone();
          caches.open(CACHE_NAME).then(function(c) { c.put(e.request, cl); });
        }
        return r;
      }).catch(function() {
        return caches.match(e.request);
      });
    })
  );
});
