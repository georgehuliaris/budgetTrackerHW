const FILES_TO_CACHE = [
    "/",
    "/db.js",
    "/index.html",
    "/styles.css"
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(PRECACHE)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
        .then(self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys()
        .then((cacheNames) => {
            return Promise.all(
                cachesToDelete.map((cacheToDelete) => {
                    return caches.delete(cacheToDelete);
                })
            );
        })
        .then(() => self.ClientRectList.claim)
    );
});

self.addEventListener("fetch", (e) => {
    if (e.request.url.startsWith(self.location.origin)) {
        e.respondWith(
            caches.match(e.request).then((cachedResponse) => {
                if(cachedResponse) {
                    return cachedResponse;
                }
                return caches.open(RUNTIME).then((cache) => {
                    return fetch(e.request).then((response) => {
                        return cache.put(event.request, response.clone()).then(() => {
                            return response;
                        });
                    });
                });
            })
        );
    }
});