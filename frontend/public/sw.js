import { BackgroundSyncPlugin } from "workbox-background-sync"
import { offlineFallback, warmStrategyCache } from "workbox-recipes"
import { NetworkOnly, StaleWhileRevalidate } from "workbox-strategies"
import { registerRoute } from "workbox-routing"
import { CacheableResponsePlugin } from "workbox-cacheable-response"
import { ExpirationPlugin } from "workbox-expiration"
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching"

cleanupOutdatedCaches()

// Precache all static assets identified by the Webpack manifest
precacheAndRoute(self.__WB_MANIFEST)

// Set up page caches (stale-while-revalidate and cache-first) for app pages
const pageCache = new StaleWhileRevalidate({
    cacheName: "page-cache",
    plugins: [
        new CacheableResponsePlugin({
            statuses: [0, 200],
        }),
        new ExpirationPlugin({
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
    ],
})

registerRoute(({ request }) => request.mode === "navigate", pageCache)

// Warm the page cache with the most important pages
warmStrategyCache({
    urls: ["/index.html", "/", "/login"],
    strategy: pageCache,
})

// Set up asset cache for style, script, and worker files, critical for the application to work
registerRoute(
    ({ request }) => ["style", "script", "worker"].includes(request.destination),
    new StaleWhileRevalidate({
        cacheName: "asset-cache",
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    }),
)

// Set up documents cache (stale-while-revalidate) for documents
registerRoute(
    ({ request }) => request.url.includes("/media/documents/"),
    new StaleWhileRevalidate({
        cacheName: "documents-cache",
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    }),
)

// Set up offline fallback
offlineFallback({
    pageFallback: "/login",
})

// Set up background sync for POST, PUT, and DELETE requests
const bgSyncPlugin = new BackgroundSyncPlugin("bgSyncQueue", {
    maxRetentionTime: 24 * 60, // Retry for max of 24 Hours
})

registerRoute(
    new RegExp(".*/applications/.*"),
    new NetworkOnly({
        plugins: [bgSyncPlugin],
    }),
    "POST",
)

registerRoute(
    new RegExp(".*/applications/.*"),
    new NetworkOnly({
        plugins: [bgSyncPlugin],
    }),
    "PUT",
)

registerRoute(
    new RegExp(".*/applications/.*"),
    new NetworkOnly({
        plugins: [bgSyncPlugin],
    }),
    "DELETE",
)

// Event listener for the installation event of the service worker
self.addEventListener("install", () => {
    console.log("Service worker installed")
})

// Event listener for the activate event of the service worker
self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim())
    console.log("Service worker activated")
})

// Event listener for the message event of the service worker
self.addEventListener("message", (event) => {
    // Skip waiting for the service worker to become active, e.g. after an update
    if (event.data && event.data.type === "SKIP_WAITING") {
        console.log("Skip waiting")
        self.skipWaiting()
    }
})

// Event listener for the fetch event of the service worker
self.addEventListener("fetch", (event) => {
    console.log("Fetch event triggered", event)
    event.respondWith(
        // Try to fetch the request
        fetch(event.request)
            .then(async (response) => {
                return response
            })
            .catch(async () => {
                // If the request fails, try to return a cached response
                return caches
                    .match(event.request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            console.log("Cache hit:", cachedResponse)
                            return cachedResponse
                        }
                        console.log("Cache miss")
                        // try to return a placeholder if the data is not available
                        return new Response("Cache miss and fetch failed", { status: 400 })
                    })
                    .catch(() => {
                        return new Response("Cache miss and fetch failed", { status: 400 })
                    })
            }),
    )
})

console.log("Service worker loaded")
