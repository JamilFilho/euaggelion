import "@/styles/globals.css";
import type { Metadata } from "next";
import { Menu } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/layout/SiteHeader/";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SearchContent } from "@/components/content/search";
import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { PushNotificationManager } from "@/components/pushNotification";
import { BibleVersionProvider } from "@/lib/context/BibleVersionContext";
import { StickyProvider } from "@/lib/context/StickyContext";
import { NavigationProvider } from "@/lib/context/NavigationContext";
import { NavigationLayer } from "@/components/layout/NavigationLayer";
import { getBibleVersions } from "@/lib/getBible";
import { Suspense } from "react";
import { InstallButton } from "@/components/layout/PWA/pwaPrompt";
import { OrganizationSchema, WebsiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
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
  }
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  const versions = getBibleVersions();

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
        <Suspense fallback={null}>
          <NavigationProvider>
            <StickyProvider>
              <BibleVersionProvider versions={versions}>
                <SiteHeader.Root>
                  <SiteHeader.Title text="Euaggelion" logo="/euaggelion-logo.svg" />
                  
                  <SiteNavigation.Root>
                    <SiteNavigation.Menu />
                    <div className="h-full flex items-center justify-center gap-4 ml-auto">
                      <PushNotificationManager />
                      <SearchContent />
                    </div>
                  </SiteNavigation.Root>

                  <SiteHeader.Navigation icon={Menu} />
                </SiteHeader.Root>

                <NavigationLayer />

                <main>
                  {children}
                </main>
              </BibleVersionProvider>
            </StickyProvider>
          </NavigationProvider>
        </Suspense>
        
        <SiteFooter.Root>
          <SiteFooter.Menu />

          <SiteFooter.Content>            
            <SiteFooter.Group>
              <SiteFooter.Title text="Euaggelion" logo="/euaggelion-logo.svg" />
              <SiteFooter.Copy copyright="CC0 1.0 Universal" content="O projeto Euaggelion é uma iniciativa cristã independente cujo objetivo central é a divulgação gratuita de conteúdo cristão e teológico. Todo material disponibilizado por meio de nosso site está diponível sob uma licença de uso de domínio público." />
            </SiteFooter.Group>
            
            <InstallButton />
          </SiteFooter.Content>
        </SiteFooter.Root>
        
        <Toaster />
      </body>
    </html>
  );
}
