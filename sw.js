const CACHE_NAME = 'vidafit-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/db.js',
  '/js/exercises.js',
  '/js/ui.js',
  '/images/placeholder.jpg',
  '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app shell');
        return cache.addAll(ASSETS);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch Event Strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cacheResponse => {
        return cacheResponse || fetch(event.request).then(fetchResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request.url, fetchResponse.clone());
            return fetchResponse;
          });
        });
      }).catch(() => {
        // Fallback for image requests
        if (event.request.url.indexOf('.jpg') > -1 || 
            event.request.url.indexOf('.png') > -1 ||
            event.request.url.indexOf('.svg') > -1) {
          return caches.match('/images/placeholder.jpg');
        }
      })
  );
});

// Push notification event
self.addEventListener('push', event => {
  const title = 'VidaFit';
  const options = {
    body: event.data.text(),
    icon: 'icons/icon-192x192.png',
    badge: 'icons/icon-72x72.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'start-workout' || event.action === 'return-app') {
        clients.openWindow('/index.html#workout');
    }

    if (event.notification.tag === 'workout-reminder') {
        clients.openWindow('/index.html#workout');
    } else if (event.notification.tag === 'meal-reminder') {
        clients.openWindow('/index.html#profile');
    } else if (event.notification.tag === 'goal-reminder') {
        clients.openWindow('/index.html#profile');
    }
});

// Add periodic sync for notifications
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'daily-notifications') {
        event.waitUntil(sendDailyNotifications());
    }
});

async function sendDailyNotifications() {
    const registration = await self.registration;
    
    // Morning workout reminder (9 AM)
    if (new Date().getHours() === 9) {
        registration.showNotification('Morning Workout Time! 🌅', {
            body: 'Start your day with energy! Time for your workout.',
            icon: 'images/logo.png',
            badge: 'images/logo.png',
            tag: 'workout-reminder'
        });
    }
    
    // Meal logging reminders (12 PM and 7 PM)
    if (new Date().getHours() === 12 || new Date().getHours() === 19) {
        registration.showNotification('Meal Time! 🍽️', {
            body: 'Remember to log your meal and stay on track!',
            icon: 'images/logo.png',
            badge: 'images/logo.png',
            tag: 'meal-reminder'
        });
    }
    
    // Evening goal check-in (8 PM)
    if (new Date().getHours() === 20) {
        registration.showNotification('Daily Goal Check! 🎯', {
            body: 'How did you do today? Check your progress!',
            icon: 'images/logo.png',
            badge: 'images/logo.png',
            tag: 'goal-reminder'
        });
    }
}