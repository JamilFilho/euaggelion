'use server'

import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:contato@euaggelion.com.br',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

let subscription: PushSubscription | null = null

export async function subscribeUser(sub: PushSubscription) {
  subscription = sub
  // Em produção, armazene em um banco de dados
  return { success: true }
}

export async function unsubscribeUser() {
  subscription = null
  // Em produção, remova do banco de dados
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('Nenhuma inscrição disponível')
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Euaggelion',
        body: message,
        icon: '/pwa/icon-192x192.png',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar notificação push:', error)
    return { success: false, error: 'Falha ao enviar notificação' }
  }
}