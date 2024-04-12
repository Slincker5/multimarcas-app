/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated () {
      console.log('New content is available; please refresh.')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })

  // Instalación de listener para la solicitud fetch
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      // Intentamos recuperar la solicitud de la caché
      caches.match(event.request).then(function(response) {
        // Si se encuentra en caché, devolver la respuesta en caché
        if (response) {
          return response;
        }

        // Si no está en caché, realizar la solicitud a la red y almacenar en caché la respuesta
        return fetch(event.request).then(function(response) {
          // Abriendo un caché dinámico
          return caches.open('images-cache').then(function(cache) {
            // Almacenar en caché la respuesta clonada
            cache.put(event.request.url, response.clone());
            // Devolver la respuesta original
            return response;
          });
        });
      })
    );
  });

  // Después de registrar el service worker...
  navigator.serviceWorker.ready.then((registration) => {
    // Comprobar si existe el evento beforeinstallprompt
    if (registration.hasOwnProperty('onbeforeinstallprompt')) {
      // Mostrar el mensaje de instalación automáticamente
      registration.onbeforeinstallprompt = (event) => {
        // Prevenir que el navegador muestre su propio mensaje de instalación
        event.preventDefault();
        // Mostrar el mensaje de instalación
        console.log('Mostrar mensaje de instalación');
        // Aquí podrías establecer una variable en el estado de Vue para mostrar un botón o mensaje de instalación en tu interfaz de usuario.
      };
    }
  });
}
