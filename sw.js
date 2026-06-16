/* Service worker for the "Text Recorder" PWA. Precaches its own thin shell PLUS
 * the shared engine it loads from the Flextext Editor repo (same origin), so the
 * recorder works fully offline.
 *
 * VERSION COUPLING — IMPORTANT: this SW caches byte copies of the editor engine
 * (/flextext-editor/js/*.js, css/app.css). Those files have their own lifecycle
 * in the editor repo. Bump VERSION here whenever you deploy — AND specifically
 * whenever the editor engine changes in a way the recorder should pick up — or
 * installed recorders keep serving a stale cached engine offline. */

const VERSION = 'v5';
const CACHE = 'text-recorder-' + VERSION;
const SHELL = [
  './',
  'index.html',
  'recorder.webmanifest',
  'icons/recorder.svg',
  'icons/recorder-192.png',
  'icons/recorder-512.png',
  'icons/recorder-apple-touch.png',
  // Shared engine + styles, served from the editor repo (same origin).
  '/flextext-editor/css/app.css',
  '/flextext-editor/js/app.js',
  '/flextext-editor/js/flextext.js',
  '/flextext-editor/js/db.js',
  '/flextext-editor/js/i18n.js',
  '/flextext-editor/js/audio.js',
  '/flextext-editor/js/convert.js',
  '/flextext-editor/js/zip.js',
  '/flextext-editor/js/upload.js',
  '/flextext-editor/js/vendor/wavesurfer.esm.js',
  '/flextext-editor/js/vendor/lame.min.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
});

function cleanupOldCaches() {
  return caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))));
}

self.addEventListener('message', (e) => {
  if (!e.data) return;
  if (e.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (e.data.type === 'CLEANUP') e.waitUntil(cleanupOldCaches());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(cleanupOldCaches().then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: e.request.mode === 'navigate' }).then(hit => {
      if (hit) return hit;
      if (e.request.mode === 'navigate') {
        return caches.match('index.html').then(shell => shell || fetch(e.request));
      }
      return fetch(e.request).then(resp => {
        if (resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return resp;
      });
    })
  );
});
