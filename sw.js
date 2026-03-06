// ═══════════════════════════════════════════════════════
//  Audit-it — Service Worker  v1.0
//  Handles: Install prompt, caching, offline fallback
// ═══════════════════════════════════════════════════════

const CACHE_NAME = 'auditit-v1';
const CACHE_URLS = [
  './',
  './index.html',
  './main.html',
  './audfaq.html',
  './prdcal.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://unpkg.com/otpauth/dist/otpauth.umd.min.js',
  'https://cdn.jsdelivr.net/npm/qrcode@1.5.0/build/qrcode.min.js'
];

// ── INSTALL: Cache all key assets ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache local files reliably; external CDN files best-effort
      const localFiles = ['./', './index.html', './main.html', './audfaq.html', './prdcal.html', './manifest.json'];
      const cdnFiles = CACHE_URLS.filter(u => u.startsWith('http'));

      return cache.addAll(localFiles).then(() => {
        // CDN files: cache each individually, ignore failures
        return Promise.allSettled(cdnFiles.map(url =>
          cache.add(url).catch(() => { /* CDN failure ok */ })
        ));
      });
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: Delete old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── FETCH: Network-first for HTML/Firebase, Cache-first for assets ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Always bypass for Firebase/Firestore/Auth requests
  if (
    url.hostname.includes('firebase') ||
    url.hostname.includes('firestore') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('github.com') ||
    url.hostname.includes('api.github.com')
  ) {
    return; // Let browser handle directly — no caching for live data
  }

  // For HTML pages: Network-first (always fresh), fallback to cache
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // For all other assets (JS, CSS, fonts): Cache-first, then network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => new Response('', { status: 503, statusText: 'Offline' }));
    })
  );
});

// ── MESSAGE: Force update from app ──
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
