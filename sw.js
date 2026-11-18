// Service worker del Atlas de Provincias: guarda el juego para usarlo sin conexión.
const CACHE = "atlas-4493825509";
const ARCHIVOS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "AtkinsonHyperlegible-1.woff2",
  "AtkinsonHyperlegible-2.woff2",
  "BricolageGrotesque-3.woff2",
  "apple-touch-icon.png",
  "d3-composite-projections.min.js",
  "d3-parcial.js",
  "fonts.css",
  "icon-192.png",
  "icon-512.png",
  "topojson.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(claves => Promise.all(claves.filter(k => k.startsWith("atlas-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    // La página: primero internet (para ver la última versión); sin conexión, la copia guardada
    e.respondWith(fetch(req).then(r => {
      const copia = r.clone(); caches.open(CACHE).then(c => c.put("./", copia)); return r;
    }).catch(() => caches.match("./", { ignoreSearch: true })));
    return;
  }
  // Librerías, tipografías e iconos: la copia guardada y, si no está, internet
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req)));
});
