// © 2026 Adela Moreno Vega y Carlos Moreno Otto. Todos los derechos reservados.
// Service worker del Atlas: guarda el juego para usarlo sin conexión.
// Al subir una versión nueva, cambia el nombre de la caché y se borra la anterior.
const CACHE = "atlas-v5.0.1-20261126";
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
  "espana.js",
  "europa.js",
  "america.js",
  "asia.js",
  "africa.js",
  "oceania.js",
  "fonts.css",
  "icon-192.png",
  "icon-512.png",
  "icon-152.png",
  "icon-167.png",
  "icon-maskable-512.png",
  "favicon-32.png",
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
  // Comprobación de versión nueva: siempre a la red
  if (/[?&]v=\d{10,}/.test(req.url)) return;
  if (req.mode === "navigate") {
    // La página: primero internet (para ver la última versión); sin conexión, la copia guardada
    e.respondWith(fetch(req.url, { cache: "no-store", credentials: "same-origin" }).then(r => {
      if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put("./", copia)); } // solo si ha llegado bien
      return r;
    }).catch(() => caches.match("./", { ignoreSearch: true })));
    return;
  }
  // Librerías, tipografías, iconos y banderas: la copia guardada y, si no está, internet (y se guarda para la próxima vez)
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req).then(r2 => {
    if (r2.ok && /\/banderas\/(es\/)?[a-z0-9-]+\.(svg|webp)$/.test(new URL(req.url).pathname)) { const copia = r2.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
    return r2;
  })));
});
