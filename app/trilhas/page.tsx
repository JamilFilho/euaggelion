import { getTrails } from '@/lib/getTrails';
import { Page } from '@/components/content/Page';
import { Feed } from '@/components/content/Feed';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/breadcrumb';

export default async function TrilhasPage() {
  const trails = await getTrails();
  
  return (
    <Page.Root>
      <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Trilhas", href: "/trilhas" }
          ]}
          sticky={true}
          topOffset={0}
      />
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
  );
}