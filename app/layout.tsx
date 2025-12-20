import "@/styles/globals.css";
import type { Metadata } from "next";
import { Menu } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/layout/SiteHeader/";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SearchContent } from "@/components/content/search";

export const metadata: Metadata = {
  title: "Euaggelion",
  description: "Semeando as boas novas da salvação",
  other: {
    'webmention': 'https://webmention.io/euaggelion.com.br/webmention',
    'pingback': 'https://webmention.io/euaggelion.com.br/xmlrpc',
  }
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="webmention" href="https://webmention.io/euaggelion.com.br/webmention" />
        <link rel="pingback" href="https://webmention.io/euaggelion.com.br/xmlrpc" />
      </head>
      <body className="bg-secondary selection:bg-accent selection:text-secondary black:selection:text-foreground">
        <SiteHeader.Root>
          <SiteHeader.Title text="Euaggelion" logo="/euaggelion-logo.svg" />

          <div className="ml-auto flex flex-row gap-4">
            <SearchContent />
            <SiteHeader.Navigation icon={Menu} />
          </div>
        </SiteHeader.Root>

        <main>
          {children}
        </main>

        <SiteFooter.Root>
          <SiteFooter.Menu />
          
          <SiteFooter.Content>
            <SiteFooter.Title text="Euaggelion" logo="/euaggelion-logo.svg" />
            <SiteFooter.Copy copyright="CC0 1.0 Universal" content="O projeto Euaggelion é uma iniciativa cristã independente cujo objetivo central é a divulgação gratuita de conteúdo cristão e teológico. Todo material disponibilizado por meio de nosso site está diponível sob uma licença de uso de domínio público." />
          </SiteFooter.Content>
        </SiteFooter.Root>
        
        <Toaster />
      </body>
    </html>
  );
}
