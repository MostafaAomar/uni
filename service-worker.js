const APP_VERSION = "14";
const SHELL_CACHE = `uniquiz-shell-v${APP_VERSION}`;
const CATALOG_CACHE = "uniquiz-catalog-v2";
const APP_SHELL = [
  "./index.html",
  "./offline.css?v=14",
  "./style.css?v=14",
  "./supabase.js?v=14",
  "./subject-storage.js?v=14",
  "./content-catalog.js?v=14",
  "./app.js?v=14",
  "./app-v12.js?v=14",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icon.png",
  "./myOwnDic.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(async (error) => {
        await caches.delete(SHELL_CACHE);
        throw error;
      }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("uniquiz-shell-") && key !== SHELL_CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function notifyOpenClients(message) {
  const clients = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
  clients.forEach((client) => client.postMessage(message));
}

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  if (event.data?.type === "REFRESH_APP_SHELL") {
    // A new worker is the atomic app-shell update. Never mutate the active
    // cache file by file because an interrupted refresh can mix releases.
    event.ports[0]?.postMessage({ ok: true, changed: false });
  }
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag !== "uniquiz-daily-update") return;
  event.waitUntil(notifyOpenClients({ type: "CHECK_CONTENT_CATALOG" }));
});

function isSubjectContent(pathname) {
  const decoded = decodeURIComponent(pathname);
  return ["First Year", "Second Year", "Third Year", "Fourth Year"].some(
    (year) => decoded.includes(`/${year}/`),
  );
}

async function catalogResponse(request) {
  const canonical = new Request(
    new URL("./content-manifest.json", self.registration.scope).href,
  );
  try {
    const fresh = await fetch(new Request(request, { cache: "no-store" }));
    if (fresh?.ok) {
      const cache = await caches.open(CATALOG_CACHE);
      await cache.put(canonical, fresh.clone());
      return fresh;
    }
    // A temporary 404/500 must not replace the last known-good catalogue.
    // Keeping the cached response also keeps downloaded-subject update states
    // usable while the publishing server is being updated.
    return (await caches.match(canonical)) || fresh;
  } catch (error) {
    const cached = await caches.match(canonical);
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (decodeURIComponent(url.pathname).endsWith("/content-manifest.json")) {
    event.respondWith(catalogResponse(request));
    return;
  }

  // Subject files are fetched only after the student presses Download or
  // Update. IndexedDB owns their offline copy; the service worker must not
  // prefetch or silently refresh them.
  if (isSubjectContent(url.pathname)) {
    event.respondWith(fetch(new Request(request, { cache: "no-store" })));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      caches
        .match("./index.html")
        .then((cached) => cached || fetch(request)),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) => cached || fetch(request),
    ),
  );
});
