const CACHE_NAME = 'tchumene-v4';
const urlsToCache = ['/'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Nunca servir index.html da cache — garante que o novo deploy é sempre carregado
  if (
    e.request.mode === 'navigate' ||
    e.request.url.endsWith('/') ||
    e.request.url.includes('index.html')
  ) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Restantes recursos: network-first com fallback para cache
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
