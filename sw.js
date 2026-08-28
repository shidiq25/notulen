// Service worker minimal — cukup untuk memenuhi syarat "installable" PWA di Android.
// Sengaja tidak melakukan caching agresif supaya data notulen selalu terbaru
// (aplikasi ini butuh koneksi internet untuk fungsi utamanya).

const CACHE_NAME = 'notulen-shell-v1';
const SHELL_FILES = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Network-first: selalu coba internet dulu (data notulen harus real-time),
// baru jatuh ke cache kalau benar-benar offline (untuk shell dasar saja).
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
