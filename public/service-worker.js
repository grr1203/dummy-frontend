// 웹 푸쉬 수신 시
self.addEventListener('push', function (event) {
  const data = event.data.json();
  console.log('event.data', data);
  console.log('event.data', typeof data.options);
  self.registration.showNotification(data.title, data.options);
});

// 푸쉬 알림 클릭 시
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
