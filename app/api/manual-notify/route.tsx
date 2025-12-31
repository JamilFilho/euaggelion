import { NextRequest, NextResponse } from 'next/server'
import { sendNotificationToAll } from '@/app/actions'
import { getSubscriptionStats } from '@/lib/kv'

/**
 * API Route para enviar notificações manualmente
 * Útil para testes e para botão manual no Tina CMS
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, url } = body
    
    // Validação básica
    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      )
    }
    
    // Enviar notificação
    const result = await sendNotificationToAll(
      title,
      message,
      url || 'https://euaggelion.com.br'
    )
    
    return NextResponse.json({
      success: result.success,
      stats: {
        sent: result.sent,
        failed: result.failed,
        removed: result.removed
      }
    })
    
  } catch (error) {
    console.error('Erro ao enviar notificação manual:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint para estatísticas
 */
export async function GET() {
  try {
    const stats = await getSubscriptionStats()
    
    return NextResponse.json({
      subscriptions: stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
