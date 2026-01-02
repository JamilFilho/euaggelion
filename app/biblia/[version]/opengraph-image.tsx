import { ImageResponse } from 'next/og'
import { getBibleVersion } from '@/lib/getBible'

export const runtime = 'nodejs'

export const alt = 'Euaggelion - Semeando as boas novas'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ version: string }> }) {
  const { version: versionId } = await params
  const version = getBibleVersion(versionId)

  if (!version) return new ImageResponse(<div style={{ display: 'flex' }}>Versão não encontrada</div>)

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#23201f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flexGrow: 1,
          }}
        >
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
            Bíblia Sagrada
          </div>

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
            {version.name}
          </div>
        </div>

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
