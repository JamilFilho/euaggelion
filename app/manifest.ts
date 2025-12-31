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
    orientation: 'portrait-primary'
  }
}