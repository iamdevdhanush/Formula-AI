/* ============================================
   FORMULAAI — SERVICE WORKER
   Offline shell caching
   ============================================ */

const CACHE_NAME = 'formulaai-v1';
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/src/styles/tokens.css',
  '/src/styles/reset.css',
  '/src/styles/typography.css',
  '/src/styles/animations.css',
  '/src/styles/components.css',
  '/src/styles/main.css',
  '/src/main.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
