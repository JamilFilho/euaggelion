import { NextRequest, NextResponse } from 'next/server'
import { sendNotificationToAll } from '@/app/actions'
import { getSubscriptionStats } from '@/lib/kv'

// Common security headers for all responses
const headers = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
}

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
    }, { headers })
    
  } catch (error) {
    console.error('Erro ao enviar notificação manual:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500, headers }
    )
  }
}

/**
 * GET endpoint para estatísticas
 * Note: This endpoint should be protected and only return minimal information
 */
export async function GET() {
  try {
    const stats = await getSubscriptionStats()
    
    // Only return basic stats, not detailed subscription info
    return NextResponse.json({
      totalSubscriptions: stats.total,
      activeThisWeek: stats.lastWeek,
      timestamp: new Date().toISOString()
    }, { headers })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500, headers }
    )
  }
}
