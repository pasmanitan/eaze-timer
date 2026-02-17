const cacheName = "eaze-timer-v0.2";
const precacheResources = [
  "/",
  "/index.html",
  "/index.js",
  "/index.css",
  "/apple-touch-icon.png",
  "/site.webmanifest",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/jingle.wav",
];

self.addEventListener("install", (event) => {
  self.skipWaiting(); // Activate immediately
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(precacheResources)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== cacheName) {
              return caches.delete(name); // Remove old caches
            }
          }),
        ),
      )
      .then(() => self.clients.claim()), // Take control immediately
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== "GET") return;

  // Network-first for HTML navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          return caches.open(cacheName).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  // Stale-while-revalidate for other assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          return caches.open(cacheName).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    }),
  );
});
