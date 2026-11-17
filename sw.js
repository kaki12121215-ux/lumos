/* Lumos · service worker. Cada versión cambia el nombre de la caché para que el móvil se actualice solo. */
const CACHE = 'lumos-1.4.1';
const ARCHIVOS = [
  './', './index.html', './manifest.webmanifest', './css/lumos.css?v=1.4.1',
  './js/base.js?v=1.4.1', './js/palabras.js?v=1.4.1', './js/contenidos.js?v=1.4.1', './js/pdf.js?v=1.4.1', './js/graficas.js?v=1.4.1', './js/senales.js?v=1.4.1', './js/app.js?v=1.4.1',
  './js/intro.js?v=1.4.1', './js/cristal.js?v=1.4.1', './js/p_inicio.js?v=1.4.1', './js/p_hoy.js?v=1.4.1', './js/p_animo.js?v=1.4.1', './js/p_recursos.js?v=1.4.1',
  './js/p_patrones.js?v=1.4.1', './js/p_cuidar.js?v=1.4.1', './js/p_nuevas.js?v=1.4.1', './js/demo.js?v=1.4.1',
  './fuentes/Gloock-Regular.ttf', './fuentes/WorkSans-Regular.ttf', './fuentes/WorkSans-Bold.ttf',
  './iconos/icono-180.png', './iconos/icono-192.png', './iconos/icono-512.png', './iconos/icono-512-maskable.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('lumos-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.match(r, { ignoreSearch: r.mode === 'navigate' }).then(hit => hit || fetch(r).then(res => {
    if (res.ok && res.type === 'basic') { const copia = res.clone(); caches.open(CACHE).then(c => c.put(r, copia)); }
    return res;
  }).catch(() => r.mode === 'navigate' ? caches.match('./index.html') : undefined)));
});
