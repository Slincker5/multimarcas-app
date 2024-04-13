// service-worker.js

// Escuchando el evento 'install', pero no realizando ninguna acción
self.addEventListener('install', function(event) {
    // No se realiza ninguna acción aquí
  });
  
  // Escuchando el evento 'fetch' y respondiendo con la solicitud original sin almacenar en caché
  self.addEventListener('fetch', function(event) {
    event.respondWith(fetch(event.request));
  });
  