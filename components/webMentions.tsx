'use client'

import { useEffect, useState } from 'react'

interface WebmentionAuthor {
  name: string
  photo?: string
  url?: string
}

interface Webmention {
  type: 'in-reply-to' | 'like-of' | 'repost-of' | 'mention-of'
  author: WebmentionAuthor
  url: string
  published?: string
  content?: {
    text?: string
    html?: string
  }
  'wm-received': string
  'wm-id': number
  'wm-source': string
  'wm-target': string
  'wm-property': string
}

interface WebmentionsProps {
  target: string // URL do artigo
}

export function Webmentions({ target }: WebmentionsProps) {
  const [mentions, setMentions] = useState<Webmention[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, ] = useState<'all' | 'replies' | 'likes' | 'reposts'>('all')

  useEffect(() => {
    async function fetchMentions() {
      try {
        const response = await fetch(`/api/webmentions?target=${encodeURIComponent(target)}`)
        const data = await response.json()
        setMentions(data.mentions || [])
      } catch (error) {
        console.error('Erro ao carregar webmentions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMentions()
  }, [target])

  const filteredMentions = mentions.filter(m => {
    if (filter === 'likes') return m['wm-property'] === 'like-of'
    if (filter === 'reposts') return m['wm-property'] === 'repost-of'
    return m['wm-property'] === 'like-of' || m['wm-property'] === 'repost-of'
  })

  const counts = {
    likes: mentions.filter(m => m['wm-property'] === 'like-of').length,
    reposts: mentions.filter(m => m['wm-property'] === 'repost-of').length,
  }

  if (loading) {
    return (
      <div className="py-8 text-center text-foreground/60">
        Carregando menções...
      </div>
    )
  }

  if (mentions.length === 0) {
    return (
      <div className="py-8 px-10 border-t border-ring/20">
        <p className="text-foreground/60 text-center">Nenhuma menção no Fediverso</p>
      </div>
    )
  }

  return (
    <section className="w-full border-t border-ring/20">
      <header className="p-10 md:px-0 border-b border-ring/20">
        <div className="md:w-3/5 md:mx-auto">
          <h3 className='text-lg font-bold'>Fediverso</h3>
          <p className="text-foreground/60">Menções deste conteúdo no fediverso</p>
        </div>
      </header>

      <div className="py-10 md:w-3/5 md:mx-auto">
          {[...filteredMentions]
            .sort((a, b) => 
              new Date(b['wm-received']).getTime() - new Date(a['wm-received']).getTime()
            )
            .map((mention) => (
              <WebmentionItem key={mention['wm-id']} mention={mention} />
            ))}
      </div>
    </section>
  )
}

function WebmentionItem({ mention }: { mention: Webmention }) {
  const isLike = mention['wm-property'] === 'like-of'
  const isRepost = mention['wm-property'] === 'repost-of'

  return (
    <div className="w-fit py-4 px-10 md:px-0 flex flex-col">
      <span className="text-sm text-foreground/60">
        {mention.published 
          ? new Date(mention.published).toLocaleDateString('pt-BR')
          : new Date(mention['wm-received']).toLocaleDateString('pt-BR')
        }
      </span>
      <a href={mention.author.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold hover:text-accent"
      >
        {mention.author.name}
      </a>

      {isLike && (
        <p className="text-foreground/60">curtiu este artigo</p>
      )}

      {isRepost && (
          <p className="text-foreground/60">
            compartilhou este artigo em <a className="text-accent underline decoration-dashed" href={mention['wm-source']}>{mention['wm-source']}</a>
          </p>
      )}

    </div>
  )
}