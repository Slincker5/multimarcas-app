importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyB0z01S4THMA_8x6jKtV1OodLHXs0J9kZ8",
  authDomain: "multimarcasapp-2fa97.firebaseapp.com",
  projectId: "multimarcasapp-2fa97",
  storageBucket: "multimarcasapp-2fa97.appspot.com",
  messagingSenderId: "732835844626",
  appId: "1:732835844626:web:d5fd4d29dd760b66bd7ecb",
  measurementId: "G-0SQH2EVZX3",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
      icon: "/icon.png", // Use the local icon
    };

    // Add click event to open a URL when notification is clicked
    notificationOptions.data = { url: "https://example.com" };

    self.registration.showNotification(notificationTitle, notificationOptions);
    
  
});

// Add event listener for notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Open the URL when the notification is clicked
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
