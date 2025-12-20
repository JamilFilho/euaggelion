export interface WebmentionAuthor {
  name: string
  photo?: string
  url?: string
}

export interface WebmentionContent {
  text?: string
  html?: string
}

export interface Webmention {
  type: 'entry'
  author: WebmentionAuthor
  url: string
  published?: string
  'wm-received': string
  'wm-id': number
  'wm-source': string
  'wm-target': string
  'wm-property': 'in-reply-to' | 'like-of' | 'repost-of' | 'mention-of' | 'bookmark-of'
  content?: WebmentionContent
  'wm-private'?: boolean
}

export interface WebmentionResponse {
  type: 'feed'
  name: string
  children: Webmention[]
}

/**
 * Busca webmentions para uma URL específica
 * @param target URL do artigo
 * @param perPage Número de menções por página (padrão: 100)
 */
export async function fetchWebmentions(
  target: string,
  perPage: number = 100
): Promise<Webmention[]> {
  const domain = 'euaggelion.com.br'
  const token = process.env.WEBMENTION_IO_TOKEN
  
  if (!token) {
    console.warn('WEBMENTION_IO_TOKEN não configurado')
    return []
  }

  try {
    const url = new URL('https://webmention.io/api/mentions.jf2')
    url.searchParams.set('domain', domain)
    url.searchParams.set('token', token)
    url.searchParams.set('per-page', perPage.toString())
    
    if (target) {
      url.searchParams.set('target', target)
    }

    const response = await fetch(url.toString(), {
      // Cache por 5 minutos em produção
      next: { revalidate: 300 }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data: WebmentionResponse = await response.json()
    
    // Filtrar menções privadas
    return data.children.filter(mention => !mention['wm-private'])
    
  } catch (error) {
    console.error('Erro ao buscar webmentions:', error)
    return []
  }
}

/**
 * Busca todas as webmentions do domínio
 */
export async function fetchAllWebmentions(): Promise<Webmention[]> {
  return fetchWebmentions('')
}

/**
 * Agrupa webmentions por tipo
 */
export function groupWebmentionsByType(mentions: Webmention[]) {
  return {
    replies: mentions.filter(m => m['wm-property'] === 'in-reply-to'),
    likes: mentions.filter(m => m['wm-property'] === 'like-of'),
    reposts: mentions.filter(m => m['wm-property'] === 'repost-of'),
    mentions: mentions.filter(m => m['wm-property'] === 'mention-of'),
    bookmarks: mentions.filter(m => m['wm-property'] === 'bookmark-of'),
  }
}

/**
 * Conta webmentions por tipo
 */
export function countWebmentionsByType(mentions: Webmention[]) {
  const grouped = groupWebmentionsByType(mentions)
  
  return {
    total: mentions.length,
    replies: grouped.replies.length,
    likes: grouped.likes.length,
    reposts: grouped.reposts.length,
    mentions: grouped.mentions.length,
    bookmarks: grouped.bookmarks.length,
  }
}

/**
 * Ordena webmentions por data (mais recentes primeiro)
 */
export function sortWebmentionsByDate(mentions: Webmention[]): Webmention[] {
  return [...mentions].sort((a, b) => {
    const dateA = new Date(a.published || a['wm-received']).getTime()
    const dateB = new Date(b.published || b['wm-received']).getTime()
    return dateB - dateA
  })
}