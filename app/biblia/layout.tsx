import { Metadata } from "next";
import { getBibleVersions } from "@/lib/getBible";
import BibleVersionSelector from "@/components/content/Bible/BibleVersionSelector";
import BibleHomeLink from "@/components/content/Bible/BibleHomeLink";
import { StickyHeader } from "@/components/layout/StickyHeader";

export const metadata: Metadata = {
  title: "Bíblia | Euaggelion",
  description: "Guardei a tua palavra em meu coração para não pecar contra ti.",
  openGraph: {
      type: 'website',
      url: 'https://euaggelion.com.br/biblia',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Bíblia | Euaggelion",
      description: "Guardei a tua palavra em meu coração para não pecar contra ti.",
    },
    other: {
      'webmention': 'https://webmention.io/euaggelion.com.br/webmention',
    },
    alternates: {
      canonical: 'https://euaggelion.com.br/biblia',
    }
};

export default function BibleLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    return(
      <section>
          <StickyHeader topOffset={0} className="left-0 px-10 flex flex-row justify-between items-center gap-2 border-b border-ring/20 bg-secondary z-[810]">
              <BibleHomeLink />
              <BibleVersionSelector />
          </StickyHeader>

          {children}
      </section>
    )
}