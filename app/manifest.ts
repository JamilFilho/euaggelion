import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Projeto Euaggelion",
    short_name: "Euaggelion",
    start_url: process.env.NEXT_PUBLIC_SITE_URL,
    id: "euaggelion",
    description: "Semeando as boas novas da salvação",
    theme_color: "#1f1d1c",
    display: "standalone",
    scope: process.env.NEXT_PUBLIC_SITE_URL,
    icons: [
      {
        src: "/pwa/icon-512x512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable"
      },
      {
        src: "/pwa/android/512x512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable"
      },
      {
        src: "/pwa/android/192x192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "maskable"
      },
      {
        src: "/pwa/android/144x144.png",
        type: "image/png",
        sizes: "144x144"
      },
      {
        src: "/pwa/android/96x96.png",
        type: "image/png",
        sizes: "96x96"
      },
      {
        src: "/pwa/android/72x72.png",
        type: "image/png",
        sizes: "72x72"
      },
      {
        src: "/pwa/android/48x48.png",
        type: "image/png",
        sizes: "48x48"
      },
      {
        src: "/pwa/ios/512.png",
        type: "image/png",
        sizes: "512x512"
      },
      {
        src: "/pwa/ios/192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "maskable"
      },
      {
        src: "/pwa/ios/180.png",
        type: "image/png",
        sizes: "180x180",
        purpose: "maskable"
      },
      {
        src: "/pwa/ios/152.png",
        type: "image/png",
        sizes: "152x152"
      },
      {
        src: "/pwa/ios/144.png",
        type: "image/png",
        sizes: "144x144"
      },
      {
        src: "/pwa/ios/120.png",
        type: "image/png",
        sizes: "120x120"
      },
      {
        src: "/pwa/ios/114.png",
        type: "image/png",
        sizes: "114x114"
      },
      {
        src: "/pwa/ios/100.png",
        type: "image/png",
        sizes: "100x100"
      },
      {
        src: "/pwa/ios/87.png",
        type: "image/png",
        sizes: "87x87"
      },
      {
        src: "/pwa/ios/80.png",
        type: "image/png",
        sizes: "80x80"
      },
      {
        src: "/pwa/ios/76.png",
        type: "image/png",
        sizes: "76x76"
      },
      {
        src: "/pwa/ios/72.png",
        type: "image/png",
        sizes: "72x72"
      },
      {
        src: "/pwa/ios/64.png",
        type: "image/png",
        sizes: "64x64"
      },
      {
        src: "/pwa/ios/60.png",
        type: "image/png",
        sizes: "60x60"
      },
      {
        src: "/pwa/ios/57.png",
        type: "image/png",
        sizes: "57x57"
      },
      {
        src: "/pwa/ios/50.png",
        type: "image/png",
        sizes: "50x50"
      },
      {
        src: "/pwa/ios/40.png",
        type: "image/png",
        sizes: "40x40"
      },
      {
        src: "/pwa/ios/32.png",
        type: "image/png",
        sizes: "32x32"
      },
      {
        src: "/pwa/ios/29.png",
        type: "image/png",
        sizes: "29x29"
      },
      {
        src: "/pwa/ios/20.png",
        type: "image/png",
        sizes: "20x20"
      },
      {
        src: "/pwa/ios/16.png",
        type: "image/png",
        sizes: "16x16"
      }
    ],
    shortcuts: [
      {
        name: "Bíblia Sagrada",
        short_name: "Bíblia",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/biblia`
      },
      {
        name: "Novas de Cada Manhã",
        short_name: "Devocionais",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/s/cada-manha`
      },
      {
        name: "TEOleigo",
        short_name: "TEOleigo",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/s/teoleigo`
      },
      {
        name: "Trilhas de Conteúdo",
        short_name: "Trilhas",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/trilhas`
      },
      {
        name: "WikiGelion",
        short_name: "Wiki",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/wiki`
      }
    ],
    background_color: "#de171e",
    categories: [
      "education",
      "religion",
      "lifestyle"
    ],
    lang: "pt-BR",
    dir: "ltr",
    orientation: "portrait-primary",
    prefer_related_applications: false
  }
}