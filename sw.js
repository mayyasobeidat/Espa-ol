self.addEventListener('fetch', (event) => {
  // هذا الكود فارغ حالياً لكنه ضروري لتفعيل خاصية التثبيت PWA
  event.respondWith(fetch(event.request));
});
