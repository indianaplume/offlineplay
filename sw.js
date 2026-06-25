const CACHE = 'offlineplay-v3';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Network-first pour index.html et manifest.json : on recupere toujours la derniere
// version en ligne quand le reseau est dispo, et on retombe sur le cache hors-ligne.
// Pour le reste (medias, etc.) on garde cache-first classique.
self.addEventListener('fetch', e => {
  const isCoreAsset = ASSETS.some(a => e.request.url.endsWith(a.replace('./', '/')) || e.request.url.endsWith(a.replace('./', '')));
  if (isCoreAsset || e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(res => {
        const resClone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, resClone));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => cached))
  );
});
