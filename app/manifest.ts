import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Projeto Euaggelion',
    short_name: 'Euaggelion',
    description: 'Semeando as boas novas da salvação',
    start_url: '/',
    display: 'standalone',
    background_color: '#1f1d1c',
    theme_color: '#1f1d1c',
    icons: [
      {
        src: '/pwa/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['education', 'religion', 'lifestyle'],
    lang: 'pt-BR',
    dir: 'ltr',
    orientation: 'portrait-primary',
    shortcuts: [
      {
        name: "Bíblia Sagrada",
        short_name: "Bíblia",
        description: "Leia as Sagradas Escrituras.",
        url: "/biblia"
      },
      {
        name: "Novas de Cada Manhã",
        short_name: "Devocionais",
        description: "Devocionais diários para edificar sua fé.",
        url: "/s/cada-manha"
      },
      {
        name: "TEOleigo",
        short_name: "TEOleigo",
        description: "Estudos e ensaios teológicos",
        url: "/s/teoleigo"
      },
      {
        name: "WikiGelion",
        short_name: "Wiki",
        description: "História do cristianismo, glossário teológico e artigos de referência.",
        url: "/wiki"
      }
    ]
  }
}