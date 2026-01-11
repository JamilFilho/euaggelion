'use client'

import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser } from '@/app/actions'
import { clientLogger } from '@/lib/logger'
import { BellOff, BellPlus } from 'lucide-react'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    } else {
      clientLogger.log('🚫 Push notifications not supported in this browser')
    }
  }, [])

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      
      // Verificar se já existe uma subscription ativa
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
      
      // Se existir subscription, verificar se está salva no servidor
      if (sub) {
        clientLogger.log('🔄 Subscription existente encontrada, verificando no servidor')
        // Você poderia adicionar uma verificação no servidor aqui se necessário
      }
    } catch (error) {
      clientLogger.error('❌ Erro ao registrar service worker:', error)
    }
  }

  async function subscribeToPush() {
    setIsLoading(true)
    try {
      // Verificar se a VAPID key está disponível
      if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        throw new Error('VAPID public key not configured')
      }
      
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        ),
      })
      
      // Serializar a subscription para enviar ao servidor
      const serializedSub = JSON.parse(JSON.stringify(sub))
      const result = await subscribeUser(serializedSub)
      
      if (result.success) {
        setSubscription(sub)
        clientLogger.log('✅ Inscrição realizada com sucesso')
      } else {
        clientLogger.error('❌ Falha ao salvar subscription no servidor')
        await sub.unsubscribe()
        setSubscription(null)
        throw new Error('Falha ao salvar inscrição')
      }
    } catch (error) {
      clientLogger.error('❌ Erro ao se inscrever:', error)
      // Forçar atualização do estado para garantir consistência
      const registration = await navigator.serviceWorker.ready
      const currentSub = await registration.pushManager.getSubscription()
      setSubscription(currentSub)
    } finally {
      setIsLoading(false)
    }
  }

  async function unsubscribeFromPush() {
    setIsLoading(true)
    try {
      if (subscription) {
        // Primeiro desinscrever no servidor
        const serverResult = await unsubscribeUser(subscription.endpoint)
        
        if (serverResult.success) {
          // Depois desinscrever no browser
          await subscription.unsubscribe()
          setSubscription(null)
          clientLogger.log('✅ Desinscrição realizada com sucesso')
        } else {
          clientLogger.error('❌ Falha ao remover subscription no servidor')
          throw new Error('Falha ao remover inscrição')
        }
      }
    } catch (error) {
      clientLogger.error('❌ Erro ao desinscrever:', error)
      // Forçar atualização do estado para garantir consistência
      const registration = await navigator.serviceWorker.ready
      const currentSub = await registration.pushManager.getSubscription()
      setSubscription(currentSub)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <>
      {subscription ? (
        <button 
          onClick={unsubscribeFromPush} 
          aria-label="Desativar as notificações"
          disabled={isLoading}
          className="disabled:opacity-50"
        >
          <BellOff className="size-5" />
        </button>
      ) : (
        <button 
          onClick={subscribeToPush} 
          aria-label="Ativar as notificações"
          disabled={isLoading}
          className="disabled:opacity-50"
        >
          <BellPlus className="size-5" />
        </button>
      )}
    </>
  )
}
