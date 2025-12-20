'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, Heart, Repeat2, ExternalLink } from 'lucide-react'

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
  const [filter, setFilter] = useState<'all' | 'replies' | 'likes' | 'reposts'>('all')

  useEffect(() => {
    async function fetchMentions() {
      try {
        const response = await fetch(
          `https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(target)}&per-page=100`
        )
        const data = await response.json()
        setMentions(data.children || [])
      } catch (error) {
        console.error('Erro ao carregar webmentions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMentions()
  }, [target])

  const filteredMentions = mentions.filter(m => {
    if (filter === 'replies') return m['wm-property'] === 'in-reply-to'
    if (filter === 'likes') return m['wm-property'] === 'like-of'
    if (filter === 'reposts') return m['wm-property'] === 'repost-of'
    return true
  })

  const counts = {
    replies: mentions.filter(m => m['wm-property'] === 'in-reply-to').length,
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
        <p className="text-foreground/60 text-center">
          Nenhuma menção no fediverso ainda. Seja o primeiro a compartilhar!
        </p>
      </div>
    )
  }

  return (
    <div className="border-t border-ring/20">
      {/* Estatísticas */}
      <div className="px-10 py-6 border-b border-ring/20">
        <h3 className="text-2xl font-bold mb-4">Discussões no Fediverso</h3>
        
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              filter === 'all' ? 'bg-accent text-background' : 'bg-muted'
            }`}
          >
            <MessageCircle className="size-4" />
            <span>Todas ({mentions.length})</span>
          </button>
          
          <button
            onClick={() => setFilter('replies')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              filter === 'replies' ? 'bg-accent text-background' : 'bg-muted'
            }`}
          >
            <MessageCircle className="size-4" />
            <span>Respostas ({counts.replies})</span>
          </button>
          
          <button
            onClick={() => setFilter('likes')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              filter === 'likes' ? 'bg-accent text-background' : 'bg-muted'
            }`}
          >
            <Heart className="size-4" />
            <span>Curtidas ({counts.likes})</span>
          </button>
          
          <button
            onClick={() => setFilter('reposts')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              filter === 'reposts' ? 'bg-accent text-background' : 'bg-muted'
            }`}
          >
            <Repeat2 className="size-4" />
            <span>Compartilhamentos ({counts.reposts})</span>
          </button>
        </div>
      </div>

      {/* Lista de Menções */}
      <div className="divide-y divide-ring/20">
        {filteredMentions.length === 0 ? (
          <div className="px-10 py-6 text-center text-foreground/60">
            Nenhuma menção deste tipo
          </div>
        ) : (
          filteredMentions.map((mention) => (
            <WebmentionItem key={mention['wm-id']} mention={mention} />
          ))
        )}
      </div>
    </div>
  )
}

function WebmentionItem({ mention }: { mention: Webmention }) {
  const isReply = mention['wm-property'] === 'in-reply-to'
  const isLike = mention['wm-property'] === 'like-of'
  const isRepost = mention['wm-property'] === 'repost-of'

  return (
    <div className="px-10 py-6 hover:bg-muted/50 transition-colors">
      <div className="flex gap-4">
        {/* Avatar */}
        {mention.author.photo ? (
          <img
            src={mention.author.photo}
            alt={mention.author.name}
            className="size-12 rounded-full"
          />
        ) : (
          <div className="size-12 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-xl font-bold">
              {mention.author.name[0].toUpperCase()}
            </span>
          </div>
        )}

        {/* Conteúdo */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            
            <a href={mention.author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:text-accent"
            >
              {mention.author.name}
            </a>
            
            {isLike && <Heart className="size-4 text-red-500 fill-red-500" />}
            {isRepost && <Repeat2 className="size-4 text-green-500" />}
            
            <span className="text-sm text-foreground/60">
              {mention.published 
                ? new Date(mention.published).toLocaleDateString('pt-BR')
                : new Date(mention['wm-received']).toLocaleDateString('pt-BR')
              }
            </span>

            
            <a href={mention.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-accent hover:underline text-sm flex items-center gap-1"
            >
              Ver no fediverso <ExternalLink className="size-3" />
            </a>
          </div>

          {/* Conteúdo da menção */}
          {isReply && mention.content && (
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: mention.content.html || mention.content.text || '' 
              }}
            />
          )}

          {isLike && (
            <p className="text-foreground/60 italic">curtiu este artigo</p>
          )}

          {isRepost && (
            <p className="text-foreground/60 italic">compartilhou este artigo</p>
          )}
        </div>
      </div>
    </div>
  )
}