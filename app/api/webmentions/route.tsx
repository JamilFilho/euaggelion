// app/api/webmentions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { fetchWebmentions } from '@/lib/webMentions'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const target = searchParams.get('target')

  if (!target) {
    return NextResponse.json(
      { error: 'Parâmetro "target" é obrigatório' },
      { status: 400 }
    )
  }

  try {
    const mentions = await fetchWebmentions(target)

    return NextResponse.json(
      { mentions, count: mentions.length },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    console.error('Erro ao buscar webmentions:', error)
    
    return NextResponse.json(
      { error: 'Erro ao buscar webmentions' },
      { status: 500 }
    )
  }
}