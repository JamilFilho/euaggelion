import { getTrails } from '@/lib/getTrails';
import { Page } from '@/components/content/Page';
import { Feed } from '@/components/content/Feed';
import Link from 'next/link';
import { TrailsBreadcrumb } from './TrailsBreadcrumb';
import type { Metadata } from 'next';
import { CollectionPageSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Trilhas de Conteúdo | Euaggelion',
  description: 'Explore nossas trilhas de estudo, com conteúdos organizados para auxiliar em seu crescimento na fé.',
  openGraph: {
    title: 'Trilhas de Conteúdo | Euaggelion',
    description: 'Explore nossas trilhas de estudo, com conteúdos organizados para auxiliar em seu crescimento na fé.',
    type: 'website',
    url: 'https://euaggelion.com.br/trilhas',
    siteName: 'Euaggelion',
    locale: 'pt_BR',
    images: [
      {
        url: 'https://euaggelion.com.br/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Trilhas de Conteúdo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trilhas de Conteúdo | Euaggelion',
    description: 'Explore nossas trilhas de estudo, com conteúdos organizados para auxiliar em seu crescimento na fé.',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
  },
  alternates: {
    canonical: 'https://euaggelion.com.br/trilhas',
  },
};

export default async function TrilhasPage() {
  const trails = await getTrails();
  
  return (
    <TrailsBreadcrumb>
      <CollectionPageSchema
        name="Trilhas de Conteúdo"
        description="Explore nossas trilhas de estudo, com conteúdos organizados para auxiliar em seu crescimento na fé."
        url={`https://euaggelion.com.br/trilhas`}
        itemCount={trails.length}
      />
      <Page.Root>
        <Page.Header>
          <Page.Title content="Trilhas" />
          <Page.Description content="Explore nossas trilhas de estudo, com conteúdos organizados para auxiliar em seu crescimento na fé" />
        </Page.Header>
        <Page.Content>
          <Feed.Root articles={trails as any} category="trilhas">
            <Feed.Group>
              <Feed.Articles category="trilhas" />
            </Feed.Group>
            <Feed.Pagination />
          </Feed.Root>
        </Page.Content>
      </Page.Root>
    </TrailsBreadcrumb>
  );
}