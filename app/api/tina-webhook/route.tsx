import { NextRequest, NextResponse } from 'next/server'
import { sendNotificationToAll } from '@/app/actions'
import matter from 'gray-matter'
import fs from 'fs/promises'
import path from 'path'

/**
 * Valida o webhook secret
 * @deprecated Authentication is now handled by middleware
 */
function validateWebhook(request: NextRequest): boolean {
  // Authentication is now handled by middleware.ts
  // This function is kept for backward compatibility but always returns true
  console.warn('⚠️  Webhook authentication is now handled by middleware')
  return true
}

/**
 * Extrai informações do arquivo de conteúdo
 */
async function getContentInfo(filePath: string): Promise<{
  title: string
  category: string
  published: boolean
  slug: string
} | null> {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    const fileContent = await fs.readFile(fullPath, 'utf-8')
    const { data } = matter(fileContent)
    
    // Extrair slug do nome do arquivo
    const slug = path.basename(filePath, path.extname(filePath))
    
    return {
      title: data.title || 'Novo Conteúdo',
      category: data.category || 'geral',
      published: data.published === true,
      slug
    }
  } catch (error) {
    console.error('Erro ao ler arquivo:', filePath, error)
    return null
  }
}

/**
 * Determina o tipo de conteúdo baseado no caminho
 */
function getContentType(filePath: string): 'article' | 'wiki' | 'page' | null {
  if (filePath.includes('content/articles/')) return 'article'
  if (filePath.includes('content/wiki/')) return 'wiki'
  if (filePath.includes('content/pages/')) return 'page'
  return null
}

/**
 * Formata a mensagem da notificação baseada no tipo e categoria
 */
function formatNotificationMessage(
  type: 'article' | 'wiki' | 'page',
  title: string,
  category: string
): { title: string; body: string } {
  const categoryLabels: Record<string, string> = {
    'biblioteca-crista': 'Biblioteca Cristã',
    'blog': 'Blog',
    'cada-manha': 'Cada Manhã',
    'ebook': 'eBook',
    'ecos-da-eternidade': 'Ecos da Eternidade',
    'editorial': 'Editorial',
    'estudos': 'Estudos',
    'orthopraxia': 'Orthopraxia',
    'parabolas': 'Parábolas',
    'planners': 'Planners',
    'sermoes': 'Sermões',
    'teoleigo': 'TEOleigo',
    'verso-a-verso': 'Verso a Verso',
    'apologetica': 'Apologética',
    'credos': 'Credos',
    'escatologia': 'Escatologia',
    'glossario': 'Glossário',
    'historia': 'História',
    'igreja-primitiva': 'Igreja Primitiva',
    'patristica': 'Patrística',
    'teologia': 'Teologia',
    'teologos': 'Teólogos',
  }
  
  const categoryLabel = categoryLabels[category] || category
  
  if (type === 'article') {
    return {
      title: 'Novo Artigo Publicado',
      body: `${title} • ${categoryLabel}`
    }
  } else if (type === 'wiki') {
    return {
      title: 'Novo material na Wiki',
      body: `${title} • ${categoryLabel}`
    }
  } else {
    return {
      title: 'Novo Conteúdo',
      body: title
    }
  }
}

/**
 * Webhook endpoint para receber notificações do GitHub Actions
 */
export async function POST(request: NextRequest) {
  try {
    // Validação do webhook é feita pelo middleware
    // Se chegou aqui, a autenticação já foi validada
    
    const body = await request.json()
    const { files } = body
    
    if (!files || typeof files !== 'string') {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      )
    }
    
    // Processar arquivos alterados
    const fileList = files.split(' ')
    const notifications: Array<{
      type: 'article' | 'wiki' | 'page'
      title: string
      body: string
      url: string
    }> = []
    
    for (const filePath of fileList) {
      const contentType = getContentType(filePath)
      
      if (!contentType) continue
      
      const contentInfo = await getContentInfo(filePath)
      
      if (!contentInfo || !contentInfo.published) {
        console.log(`⏭️ Pulando ${filePath} (não publicado ou erro)`)
        continue
      }
      
      const { title, body } = formatNotificationMessage(
        contentType,
        contentInfo.title,
        contentInfo.category
      )
      
      // Determinar URL baseada no tipo
      let url = 'https://euaggelion.com.br'
      if (contentType === 'article') {
        url = `https://euaggelion.com.br/${contentInfo.slug}`
      } else if (contentType === 'wiki') {
        url = `https://euaggelion.com.br/wiki/${contentInfo.slug}`
      } else if (contentType === 'page') {
        url = `https://euaggelion.com.br/p/${contentInfo.slug}`
      }
      
      notifications.push({ type: contentType, title, body, url })
    }
    
    // Se não há notificações para enviar
    if (notifications.length === 0) {
      return NextResponse.json({
        message: 'No notifications to send',
        processed: fileList.length
      })
    }
    
    // Enviar apenas a primeira notificação (evitar spam)
    const notification = notifications[0]
    const result = await sendNotificationToAll(
      notification.title,
      notification.body,
      notification.url
    )
    
    console.log('📨 Notificação enviada:', {
      title: notification.title,
      sent: result.sent,
      failed: result.failed,
      removed: result.removed
    })
    
    return NextResponse.json({
      success: true,
      notification: {
        title: notification.title,
        body: notification.body
      },
      stats: {
        sent: result.sent,
        failed: result.failed,
        removed: result.removed
      }
    })
    
  } catch (error) {
    console.error('❌ Erro no webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'tina-webhook',
    timestamp: new Date().toISOString()
  })
}
