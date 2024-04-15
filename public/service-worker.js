// service-worker.js

// Escuchando el evento 'install', pero no realizando ninguna acción
self.addEventListener("install", function (event) {
  // No se realiza ninguna acción aquí
});

// Escuchando el evento 'fetch' y respondiendo con la solicitud original sin almacenar en caché
self.addEventListener("fetch", function (event) {
  event.respondWith(fetch(event.request));
});

self.addEventListener('notificationclick', function(event) {
    const notification = event.notification;
    const action = event.action;
  
    if (action === 'detalles') {
      // Manejar la acción 'detalles'
      console.log('El usuario hizo clic en "Ver detalles"');
      // Aquí puedes agregar tu lógica para manejar esta acción
    } else if (action === 'responder') {
      // Manejar la acción 'responder'
      console.log('El usuario hizo clic en "Responder"');
      // Aquí puedes agregar tu lógica para manejar esta acción
    } else {
      // Manejar el clic en la notificación sin una acción específica
      console.log('El usuario hizo clic en la notificación sin una acción específica');
      // Aquí puedes agregar tu lógica para manejar este caso, por ejemplo, abrir una ventana o pestaña específica.
    }
  
    // Cerrar la notificación
   // notification.close();
  });
  