import type { Metadata } from 'next';
import { Article } from "@/components/content/Article";
import { ChronologyProvider } from "@/lib/context/ChronologyContext";
import { ChronologyTimeline } from "@/components/content/Chronology/ChronologyTimeline";
import { CronologyFilterSelect } from "@/components/content/Chronology/CronologyFilterSelect";
import { ArticleSchema, BreadcrumbSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Page } from '@/components/content/Page';
import { StickySection } from '@/components/layout/StickySection';

export const metadata: Metadata = {
  title: "Cronologia Bíblica | Wiki | Euaggelion",
  description: "Explore a cronologia bíblica com múltiplas perspectivas: Vida de Moisés, Reino de Davi, Exílio na Babilônia, Período Intertestamentário e Igreja Primitiva.",
  keywords: ["cronologia", "bíblica", "história", "eventos", "timeline"],
  openGraph: {
    title: "Cronologia Bíblica | Wiki | Euaggelion",
    description: "Explore a cronologia bíblica com múltiplas perspectivas.",
    type: 'article',
    url: `https://euaggelion.com.br/wiki/cronologia`,
    siteName: "Euaggelion",
    locale: "pt_BR",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `https://euaggelion.com.br/wiki/cronologia`,
  },
};

export default function CronologiaPage() {
  return (
    <>
      {/* Schema estruturado de artigo */}
      <ArticleSchema
        title="Cronologia Bíblica"
        description="Explore a cronologia bíblica com múltiplas perspectivas"
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
        imageUrl={`https://euaggelion.com.br/api/og?slug=cronologia-biblica`}
        url={`https://euaggelion.com.br/wiki/cronologia`}
      />
      
      {/* Schema de breadcrumbs */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://euaggelion.com.br" },
          { name: "Wiki", url: "https://euaggelion.com.br/wiki" },
          { name: "Cronologia", url: "https://euaggelion.com.br/wiki/cronologia" },
        ]}
      />
      <Page.Root>
        <ChronologyProvider activeFilter="all">
            <StickySection as="div" topOffset={0} className="z-10 bg-secondary">
                <CronologyFilterSelect />
            </StickySection>
        
        <Page.Content>
            <div className="relative mt-12 pb-2">
                <ChronologyTimeline loadAll={true} />
            </div>
        </Page.Content>
        </ChronologyProvider>
      </Page.Root>
    </>
  );
}