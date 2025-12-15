import "@/styles/globals.css";
import type { Metadata } from "next";
import { Menu } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/layout/SiteHeader/";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Euaggelion",
  description: "Semeando as boas novas da salvação",
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="pt-br">
      <body className="bg-secondary">
        <SiteHeader.Root>
          <SiteHeader.Title text="Euaggelion" logo="/euaggelion-logo.svg" />
          <SiteHeader.Navigation icon={Menu} />
        </SiteHeader.Root>

        <main>
          {children}
        </main>

        <SiteFooter.Root>
          <SiteFooter.Menu />
          <SiteFooter.Copy copyright="CC0 1.0 Universal — Euaggelion" content="O projeto Euaggelion é uma iniciativa cristã independente cujo objetivo central é a divulgação gratuita de conteúdo cristão e teológico. Todo material disponibilizado por meio de nosso site está diponível sob uma licença de uso de domínio público." />
        </SiteFooter.Root>
        
        <Toaster />
      </body>
    </html>
  );
}
