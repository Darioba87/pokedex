const CACHE_NAME = "pokeapp-cache-v1";
const API_CACHE_NAME = "pokeapp-api-cache-v1";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/single.html",
  "/bookmarks.html",
  "/location.html",
  "/impress.html",
  "/manifest.json",
  "/css/style.css",
  "/css/bulma.min.css",
  "/js/leaflet/leaflet.css",
  "/data/pokemon_geojson_data.geojson",
  "/data/pokemon_types_with_colors.json",
  "/js/leaflet/leaflet.js",
  "/js/leaflet/leaflet.js.map",
  "/js/modules/bookmarks.js",
  "/js/modules/db.js",
  "/js/modules/idb-src.js",
  "/js/modules/lib.js",
  "/js/modules/main.js",
  "/js/modules/maps.js",
  "/js/modules/main.js",
  "/js/modules/menu.js",
  "/js/modules/single.js",
  "/js/app.js",
  "/assets/card-background.webp",
  "/assets/Comic-style-background.webp",
  "/assets/galaxy-planets-digital-art.webp",
  "/assets/heart.svg",
  "/assets/keyboard-backspace.svg",
  "/assets/favicon/android-chrome-192x192.png",
  "/assets/favicon/android-chrome-512x512.png",
  "/assets/favicon/apple-touch-icon.png",
  "/assets/favicon/favicon-16x16.png",
  "/assets/favicon/favicon-32x32.png",
  "/assets/favicon/favicon.ico",
  "/assets/favicon/site.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME
          )
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Manejo de solicitudes a la API
  if (requestUrl.origin.includes("pokeapi.co")) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) =>
        fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cache.match(event.request))
      )
    );
  } else if (STATIC_ASSETS.includes(requestUrl.pathname)) {
    // Manejo de solicitudes de recursos estáticos
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
