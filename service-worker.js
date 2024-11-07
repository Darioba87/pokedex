const CACHE_NAME = "pokeapp-cache-v1";
const API_CACHE_NAME = "pokeapp-api-cache-v1";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./single.html",
  "./bookmarks.html",
  "./location.html",
  "./impress.html",
  "./404.html",
  "./manifest.json",
  "./css/style.css",
  "./css/style.min.css",
  "./css/bulma.min.css",
  "./js/leaflet/leaflet.css",
  "./js/leaflet/leaflet.min.css",
  "./data/pokemon_geojson_data.geojson",
  "./data/pokemon_types_with_colors.json",
  "./js/leaflet/leaflet.js",
  "./js/leaflet/leaflet.js.map",
  "./js/modules/bookmarks.js",
  "./js/modules/bookmarks.min.js",
  "./js/modules/db.js",
  "./js/modules/db.min.js",
  "./js/modules/idb-src.js",
  "./js/modules/idb-src.min.js",
  "./js/modules/lib.js",
  "./js/modules/lib.min.js",
  "./js/modules/main.js",
  "./js/modules/main.min.js",
  "./js/modules/maps.js",
  "./js/modules/maps.min.js",
  "./js/modules/menu.js",
  "./js/modules/menu.min.js",
  "./js/modules/single.js",
  "./js/modules/single.min.js",
  "./js/app.js",
  "./js/app.min.js",
  "./assets/card-background.webp",
  "./assets/Comic-style-background.webp",
  "./assets/confused.webp",
  "./assets/empty-removebg-preview.webp",
  "./assets/galaxy-planets-digital-art.webp",
  "./assets/heart.svg",
  "./assets/keyboard-backspace.svg",
  "./assets/favicon/android-chrome-192x192.png",
  "./assets/favicon/android-chrome-512x512.png",
  "./assets/favicon/apple-touch-icon.png",
  "./assets/favicon/favicon-16x16.png",
  "./assets/favicon/favicon-32x32.png",
  "./assets/favicon/favicon.ico",
  "./assets/favicon/site.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
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

  // Handle requests to the API by caching API responses
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
  } else {
    const relativePath = requestUrl.pathname.replace(/^\/[^\/]+\//, "/");
    const assetPath = STATIC_ASSETS.includes(relativePath)
      ? relativePath
      : requestUrl.pathname;

    if (STATIC_ASSETS.includes(assetPath)) {
      event.respondWith(
        caches.match(event.request).then((response) => {
          return response || fetch(event.request);
        })
      );
    }
  }
});
