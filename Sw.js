
const CACHE = 'tempera-driver-v1';
const ASSETS = ['/login.html','/manifest.json','/logo-tempera-classic.png','/icon-192.png','/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
