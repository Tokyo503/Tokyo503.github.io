// Offline cache for the HTML5 game (the 40 MB Godot build is not cached).
const CACHE = 'oasis-falcon-2ea15743df';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon_192.png', 'icons/icon_512.png', 'icons/icon_512_maskable.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('oasis-falcon-') && k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.includes('/godot/') || url.pathname.endsWith('.apk')) return;
  // Network first (fresh when online), cache when offline.
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
