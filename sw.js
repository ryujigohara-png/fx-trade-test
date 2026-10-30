const CACHE_NAME = 'fx-trade-test-v1';

// インストール時に即座にアクティブ化
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// アクティブ化時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// フェッチ時にネットワークを優先し、失敗したらキャッシュを使う
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});