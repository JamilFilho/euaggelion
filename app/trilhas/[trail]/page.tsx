import { Page } from '@/components/content/Page';
import { Feed } from '@/components/content/Feed';
import { getTrailSteps, getTrails } from '@/lib/getTrails';
import { TRAILS } from '@/lib/trails';
import Breadcrumb from '@/components/ui/breadcrumb';
import type { Metadata } from 'next';
import { CollectionPageSchema, BreadcrumbSchema } from '@/lib/schema';

export async function generateStaticParams() {
  const trails = await getTrails();
  return trails.map((trail) => ({
    trail: trail.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ trail: string }> }): Promise<Metadata> {
  const { trail } = await params;
  const trailMeta = TRAILS[trail] ?? { name: trail, description: '' };

  const title = `${trailMeta.name} | Trilhas | Euaggelion`;
  const description = trailMeta.description || `Explore os conteúdos da trilha ${trailMeta.name}.`;

  return {
    title,
    description,
    keywords: ['trilha', trailMeta.name, 'estudo bíblico', 'crescimento espiritual', 'discipulado'],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://euaggelion.com.br/trilhas/${trail}`,
      siteName: 'Euaggelion',
      locale: 'pt_BR',
      images: [
        {
          url: 'https://euaggelion.com.br/og-image.png',
          width: 1200,
          height: 630,
          alt: trailMeta.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
    alternates: {
      canonical: `https://euaggelion.com.br/trilhas/${trail}`,
    },
  };
}

export default async function TrailPage({ params }: { params: Promise<{ trail: string }> }) {
  const { trail } = await params;
  const steps = await getTrailSteps(trail);
  const trailMeta = TRAILS[trail] ?? { name: trail, description: '' };
  
  return (
    <Page.Root>
      <CollectionPageSchema
        name={trailMeta.name}
        description={trailMeta.description || `Explore os conteúdos da trilha ${trailMeta.name}.`}
        url={`https://euaggelion.com.br/trilhas/${trail}`}
        itemCount={steps.length}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://euaggelion.com.br' },
          { name: 'Trilhas', url: 'https://euaggelion.com.br/trilhas' },
          { name: trailMeta.name, url: `https://euaggelion.com.br/trilhas/${trail}` },
        ]}
      />
      <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Trilhas", href: "/trilhas" },
            { label: trailMeta.name, href: `/trilhas/${trail}` },
          ]}
          sticky={true}
          topOffset={0}
      />
      <Page.Header>
        <Page.Title content={trailMeta.name} />
        {trailMeta.description && (
          <Page.Description content={trailMeta.description} />
        )}
      </Page.Header>
      <Page.Content>
        <Feed.Root articles={steps as any} category="steps" trailSlug={trail}>
          <Feed.Group>
            <Feed.Articles category="steps" />
          </Feed.Group>
          <Feed.Pagination />
        </Feed.Root>
      </Page.Content>
    </Page.Root>
  );
}