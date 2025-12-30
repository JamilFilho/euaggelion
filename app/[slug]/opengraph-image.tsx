import { ImageResponse } from 'next/og'
import { getArticleBySlug } from '@/lib/getArticles'
import { CATEGORIES } from '@/lib/categories'

// Importante: Usar nodejs para permitir o uso de 'fs' dentro do getArticleBySlug
export const runtime = 'nodejs'

export const alt = 'Euaggelion - Semeando as boas novas'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) return new ImageResponse(<div>Artigo não encontrado</div>)

  const categoryMeta = CATEGORIES[article.category] ?? { name: article.category }
  const categoryName = typeof categoryMeta === 'string' ? categoryMeta : categoryMeta.name

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#23201f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start', // Centraliza horizontalmente
          justifyContent: 'center', // Centraliza verticalmente
          padding: '80px',
          fontFamily: 'sans-serif'
        }}
      >
        {/* Bloco Central (Badge + Título) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flexGrow: 1, // Faz este bloco ocupar o espaço central
          }}
        >
          {/* Badge da Categoria */}
          <div
            style={{
              background: '#d12026',
              color: '#23201f',
              padding: '8px 24px',
              fontSize: '18px',
              marginBottom: '24px',
              textTransform: 'uppercase',
            }}
          >
            {categoryName}
          </div>

          {/* Título do Artigo */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1.1,
              maxWidth: '1000px',
              wordBreak: 'break-word',
            }}
          >
            {article.title}
          </div>
        </div>

        {/* Rodapé (Fixo na parte inferior) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            paddingTop: '40px',
          }}
        >
          <div style={{ fontSize: '24px', color: '#a0a0a0', fontWeight: '500' }}>
            euaggelion.com.br
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
