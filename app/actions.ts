'use server'

import webpush from 'web-push'
import { 
  saveSubscription, 
  removeSubscription, 
  getAllSubscriptions,
  updateLastNotified,
  type PushSubscriptionData 
} from '@/lib/kv'

webpush.setVapidDetails(
  'mailto:contato@euaggelion.com.br',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

type WebPushSubscription = {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

/**
 * Converte ArrayBuffer para Base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/**
 * Inscreve um usuário para receber notificações push
 */
export async function subscribeUser(sub: PushSubscription) {
  try {
    const subscriptionData: PushSubscriptionData = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: arrayBufferToBase64(sub.getKey('p256dh')!),
        auth: arrayBufferToBase64(sub.getKey('auth')!)
      },
      subscribedAt: new Date().toISOString()
    }
    
    await saveSubscription(subscriptionData)
    
    console.log('✅ Subscription salva com sucesso:', sub.endpoint.substring(0, 50))
    
    return { success: true }
  } catch (error) {
    console.error('❌ Erro ao salvar subscription:', error)
    return { success: false, error: 'Falha ao salvar inscrição' }
  }
}

/**
 * Remove inscrição de um usuário
 */
export async function unsubscribeUser(endpoint: string) {
  try {
    await removeSubscription(endpoint)
    
    console.log('✅ Subscription removida:', endpoint.substring(0, 50))
    
    return { success: true }
  } catch (error) {
    console.error('❌ Erro ao remover subscription:', error)
    return { success: false, error: 'Falha ao remover inscrição' }
  }
}

/**
 * Envia notificação para um único usuário (para testes)
 */
export async function sendNotification(message: string, endpoint?: string) {
  try {
    const subscriptions = await getAllSubscriptions()
    
    if (subscriptions.length === 0) {
      throw new Error('Nenhuma inscrição disponível')
    }
    
    // Se endpoint específico foi fornecido, enviar apenas para ele
    const targetSubscriptions = endpoint 
      ? subscriptions.filter(sub => sub.endpoint === endpoint)
      : [subscriptions[0]] // Envia para o primeiro se nenhum endpoint especificado
    
    if (targetSubscriptions.length === 0) {
      throw new Error('Subscription não encontrada')
    }
    
    const subscription = targetSubscriptions[0]
    
    await webpush.sendNotification(
      subscription as any,
      JSON.stringify({
        title: 'Euaggelion',
        body: message,
        icon: '/pwa/icon-192x192.png',
      })
    )
    
    await updateLastNotified(subscription.endpoint)
    
    return { success: true }
  } catch (error) {
    console.error('❌ Erro ao enviar notificação push:', error)
    return { success: false, error: 'Falha ao enviar notificação' }
  }
}

/**
 * Envia notificação para todos os usuários inscritos
 */
export async function sendNotificationToAll(
  title: string, 
  body: string, 
  url?: string
): Promise<{
  success: boolean
  sent: number
  failed: number
  removed: number
}> {
  const subscriptions = await getAllSubscriptions()
  
  if (subscriptions.length === 0) {
    return { success: false, sent: 0, failed: 0, removed: 0 }
  }
  
  let sent = 0
  let failed = 0
  let removed = 0
  
  const payload = JSON.stringify({
    title,
    body,
    icon: '/pwa/icon-192x192.png',
    url: url || 'https://euaggelion.com.br',
  })
  
  // Enviar notificações em paralelo
  const results = await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription as any, payload)
        await updateLastNotified(subscription.endpoint)
        return { success: true, endpoint: subscription.endpoint }
      } catch (error: any) {
        // Se a subscription expirou (410 Gone), remover do banco
        if (error.statusCode === 410) {
          await removeSubscription(subscription.endpoint)
          return { success: false, removed: true, endpoint: subscription.endpoint }
        }
        
        console.error(`Falha ao enviar para ${subscription.endpoint.substring(0, 50)}:`, error)
        return { success: false, removed: false, endpoint: subscription.endpoint }
      }
    })
  )
  
  // Contar resultados
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      if (result.value.success) {
        sent++
      } else if (result.value.removed) {
        removed++
      } else {
        failed++
      }
    } else {
      failed++
    }
  })
  
  console.log(`📊 Notificações enviadas: ${sent} | Falharam: ${failed} | Removidas: ${removed}`)
  
  return {
    success: sent > 0,
    sent,
    failed,
    removed
  }
}
