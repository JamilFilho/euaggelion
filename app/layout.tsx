// app/layout.tsx

import "@/styles/globals.css";
import type { Metadata } from "next";
import { OrganizationSchema, WebsiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL('https://euaggelion.com.br'),
  title: "Euaggelion | Semeando as boas novas da salvação",
  description: "Semeando as boas novas da salvação. Artigos, estudos bíblicos, devocionais e meditações sobre as temáticas da fé cristã.",
  keywords: ["bíblia", "cristianismo", "teologia", "devocionais", "estudos bíblicos"],
  authors: [{ name: "Euaggelion" }],
  creator: "Euaggelion",
  openGraph: {
    title: "Euaggelion | Semeando as boas novas da salvação",
    description: "Semeando as boas novas da salvação. Artigos, estudos bíblicos, devocionais e meditações sobre as temáticas da fé cristã.",
    url: "https://euaggelion.com.br",
    siteName: "Euaggelion",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "https://euaggelion.com.br/og-image.png",
        width: 1200,
        height: 630,
        alt: "Euaggelion - Semeando as boas novas da salvação",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Euaggelion",
    description: "Semeando as boas novas da salvação",
    images: ["https://euaggelion.com.br/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "", // Adicione seu código de verificação do Google
    // yandex: "", // Adicione se necessário
  },
  other: {
    'webmention': 'https://webmention.io/euaggelion.com.br/webmention',
    'pingback': 'https://webmention.io/euaggelion.com.br/xmlrpc',
  },
  manifest: '/manifest.webmanifest'
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {

  return (
    <html lang="pt-br">
      <head>
        {/* Schemas estruturados */}
        <OrganizationSchema />
        <WebsiteSchema />
        
        {/* Links de relação */}
        <link rel="webmention" href="https://webmention.io/euaggelion.com.br/webmention" />
        <link rel="pingback" href="https://webmention.io/euaggelion.com.br/xmlrpc" />
        <link rel="me" href="https://mastodon.social/@euaggelion" />
        
        {/* Preconnect para otimização */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-secondary selection:bg-accent selection:text-secondary black:selection:text-foreground">
        <main>
            {children}
        </main>
      </body>
    </html>
  );
}
