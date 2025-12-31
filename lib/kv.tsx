import { Redis } from '@upstash/redis'
import crypto from 'crypto'

// Inicializar Upstash Redis com variáveis de ambiente da Vercel
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export type PushSubscriptionData = {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
  subscribedAt: string
  lastNotified?: string
}

/**
 * Gera um hash único para o endpoint da subscription
 */
function hashEndpoint(endpoint: string): string {
  return crypto.createHash('sha256').update(endpoint).digest('hex').substring(0, 16)
}

/**
 * Salva uma subscription no Upstash Redis
 */
export async function saveSubscription(subscription: PushSubscriptionData): Promise<void> {
  const hash = hashEndpoint(subscription.endpoint)
  const key = `subscription:${hash}`
  
  await redis.set(key, subscription)
  await redis.sadd('subscriptions:all', hash)
}

/**
 * Remove uma subscription do Upstash Redis
 */
export async function removeSubscription(endpoint: string): Promise<void> {
  const hash = hashEndpoint(endpoint)
  const key = `subscription:${hash}`
  
  await redis.del(key)
  await redis.srem('subscriptions:all', hash)
}

/**
 * Busca todas as subscriptions ativas
 */
export async function getAllSubscriptions(): Promise<PushSubscriptionData[]> {
  const hashes = await redis.smembers('subscriptions:all')
  
  if (!hashes || hashes.length === 0) {
    return []
  }
  
  const keys = hashes.map(hash => `subscription:${hash}`)
  const subscriptions = await redis.mget<PushSubscriptionData[]>(...keys)
  
  // Filtrar nulls (subscriptions que foram deletadas)
  return subscriptions.filter((sub): sub is PushSubscriptionData => sub !== null)
}

/**
 * Busca uma subscription específica pelo endpoint
 */
export async function getSubscription(endpoint: string): Promise<PushSubscriptionData | null> {
  const hash = hashEndpoint(endpoint)
  const key = `subscription:${hash}`
  
  return await redis.get<PushSubscriptionData>(key)
}

/**
 * Atualiza o timestamp de última notificação
 */
export async function updateLastNotified(endpoint: string): Promise<void> {
  const subscription = await getSubscription(endpoint)
  
  if (subscription) {
    subscription.lastNotified = new Date().toISOString()
    await saveSubscription(subscription)
  }
}

/**
 * Retorna estatísticas das subscriptions
 */
export async function getSubscriptionStats(): Promise<{
  total: number
  lastDay: number
  lastWeek: number
}> {
  const subscriptions = await getAllSubscriptions()
  const now = Date.now()
  const oneDayAgo = now - 24 * 60 * 60 * 1000
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000
  
  return {
    total: subscriptions.length,
    lastDay: subscriptions.filter(sub => 
      new Date(sub.subscribedAt).getTime() > oneDayAgo
    ).length,
    lastWeek: subscriptions.filter(sub => 
      new Date(sub.subscribedAt).getTime() > oneWeekAgo
    ).length,
  }
}
