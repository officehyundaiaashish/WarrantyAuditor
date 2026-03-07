// Audit-it Service Worker v1.1
const CACHE = 'auditit-v1';
const LOCAL = ['./', './index.html', './main.html', './audfaq.html', './prdcal.html', './manifest.json'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(LOCAL).catch(() => {})));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    const skip = ['firebase','firestore','googleapis','gstatic','github','jsdelivr','cdnjs','unpkg','tailwind'];
    if (skip.some(h => url.href.includes(h))) return;
    if (e.request.mode === 'navigate') {
        e.respondWith(fetch(e.request).then(r => { caches.open(CACHE).then(c => c.put(e.request, r.clone())); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
        return;
    }
    e.respondWith(caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(r => { if (r && r.status === 200) caches.open(CACHE).then(c => c.put(e.request, r.clone())); return r; }).catch(() => new Response('', { status: 503 }));
    }));
});

self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
