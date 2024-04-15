importScripts("https://js.pusher.com/beams/service-worker.js");

// Add event listener for notification click
self.addEventListener("notificationclick", function (event) {
    if (event.action === "detalles") {
      const ruta = `/cintillo/${event.notification.data.uuid}`
      event.notification.close();
  
      // Open the URL when the notification is clicked
      event.waitUntil(clients.openWindow(ruta));
    }
  });