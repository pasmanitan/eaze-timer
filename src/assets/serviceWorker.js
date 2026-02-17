const cacheName = "eaze-timer-v13";
const cacheAssets = [
  "/",
  "/index.html",
  "/index.js",
  "/index.css",
  "/apple-touch-icon.png",
  "/site.webmanifest",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/jingle.wav",
  "/serviceWorker.js",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  console.log("Service worker is installed");
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("Caching assets");
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service worker is activated");

  // removes old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return cacheNames.map((cache) => {
        if (cache !== cacheName) {
          console.log("Clearing old caches");
          caches.delete(cache);
        }
      });
    }),
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Fetch intercepted for:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }),
  );
});
