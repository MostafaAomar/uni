const CACHE_NAME = 'uni-quiz-cache-v1';

// Every local asset listed here will be available 100% offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './modern_drama.json',
  // Your 15+ local JSON files
  './data/world_lit.json',
  './data/grammar.json',
  './data/phonetics.json',
  './data/linguistics.json',
  './data/literary_criticism.json',
  './data/history_of_english.json',
  './data/translation_theory.json',
  './data/poetry.json',
  './data/drama.json',
  './data/novel.json',
  './data/morphology.json',
  './data/syntax.json',
  './data/semantics.json',
  './data/pragmatics.json',
  './data/discourse_analysis.json'
];

// 1. Install Event - Downloading assets to local cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching all offline quiz assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event - Cleaning old cache updates automatically
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Removing old app cache contents:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event - Pull assets from cache directly without needing internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return local cache immediately; if not found, pull from network
      return cachedResponse || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});