self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || '/pwa/icon-192x192.png',
      badge: '/pwa/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        url: data.url || 'https://euaggelion.com.br',
      },
      actions: [
        {
          action: 'open',
          title: 'Abrir'
        },
        {
          action: 'close',
          title: 'Fechar'
        }
      ]
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  
  // Se o usuário clicou em "Fechar", não fazer nada
  if (event.action === 'close') {
    return
  }
  
  // Pegar a URL da notificação ou usar a URL padrão
  const urlToOpen = event.notification.data?.url || 'https://euaggelion.com.br'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        // Se já existe uma aba aberta com o site, focar nela
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url.includes('euaggelion.com.br') && 'focus' in client) {
            return client.focus().then(client => {
              // Navegar para a URL específica
              if ('navigate' in client) {
                return client.navigate(urlToOpen)
              }
            })
          }
        }
        
        // Se não existe aba aberta, abrir uma nova
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Evento de instalação do service worker
self.addEventListener('install', function(event) {
  console.log('Service Worker instalado')
  self.skipWaiting()
})

// Evento de ativação do service worker
self.addEventListener('activate', function(event) {
  console.log('Service Worker ativado')
  event.waitUntil(clients.claim())
})
