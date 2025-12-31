'use client'

import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser } from '@/app/actions'
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
    }
  }, [])

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
    } catch (error) {
      console.error('Erro ao registrar service worker:', error)
    }
  }

  async function subscribeToPush() {
    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      })
      
      setSubscription(sub)
      
      // Serializar a subscription para enviar ao servidor
      const serializedSub = JSON.parse(JSON.stringify(sub))
      const result = await subscribeUser(serializedSub)
      
      if (!result.success) {
        console.error('Falha ao salvar subscription no servidor')
        await sub.unsubscribe()
        setSubscription(null)
      }
    } catch (error) {
      console.error('Erro ao se inscrever:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function unsubscribeFromPush() {
    setIsLoading(true)
    try {
      if (subscription) {
        // Primeiro desinscrever no servidor
        await unsubscribeUser(subscription.endpoint)
        
        // Depois desinscrever no browser
        await subscription.unsubscribe()
        setSubscription(null)
      }
    } catch (error) {
      console.error('Erro ao desinscrever:', error)
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
