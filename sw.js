const CACHE_NAME = 'tchumene-v2';
const ASSETS = ['/', '/index.html', '/manifest.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const isSameOrigin = new URL(e.request.url).origin === self.location.origin;
  if (isSameOrigin) {
    e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
      if (r.ok) { const cl = r.clone(); caches.open(CACHE_NAME).then(c => c.put(e.request, cl)); }
      return r;
    })));
  } else {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  }
});
