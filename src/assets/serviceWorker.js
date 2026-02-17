const cacheName = "eaze-timer-v20";
const cacheAssets = [
  "/",
  "/index.html",
  "/favicon.ico",
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
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      cache.addAll(cacheAssets);
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== cacheName) {
            return caches.delete(name);
          }
          return undefined;
        }),
      );
      await clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(event.request.url);
      if (cachedResponse) {
        return cachedResponse;
      }
      return new Response(null, { status: 404 });
    })(),
  );
});
