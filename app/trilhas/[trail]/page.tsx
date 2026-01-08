import { Page } from '@/components/content/Page';
import { Feed } from '@/components/content/Feed';
import { getTrailSteps } from '@/lib/getTrails';
import { TRAILS } from '@/lib/trails';
import Breadcrumb from '@/components/ui/breadcrumb';

export default async function TrailPage({ params }: { params: Promise<{ trail: string }> }) {
  const { trail } = await params;
  const steps = await getTrailSteps(trail);
  const trailMeta = TRAILS[trail] ?? { name: trail, description: '' };
  
  return (
    <Page.Root>
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