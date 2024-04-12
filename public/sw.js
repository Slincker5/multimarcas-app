var CACHE_NAME = 'multimarcas-pwa';

let deferredPrompt;

self.addEventListener('beforeinstallprompt', function(event) {
  // Guardar el evento para mostrar la ventana de instalación automáticamente
  deferredPrompt = event;
  // Mostrar la ventana de instalación automáticamente
  deferredPrompt.prompt();
  // Esperar a que el usuario responda a la ventana de instalación
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('El usuario ha aceptado la instalación de la aplicación');
    } else {
      console.log('El usuario ha rechazado la instalación de la aplicación');
    }
    // Limpiar la variable para evitar que se muestre la ventana de instalación nuevamente
    deferredPrompt = null;
  });
});

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/apple-touch-icon.png',
          '/favicon-32x32.png',
          '/favicon-16x16.png',
          '/manifest.json'
        ]);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(function(response) {
            // Comprobamos si la respuesta es válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});
