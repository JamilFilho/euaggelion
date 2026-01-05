import type { Metadata } from 'next';
import { getAllWikiCategory, getWikiCategories } from "@/lib/getWiki";
import { CATEGORIES } from "@/lib/categories";
import { Page } from "@/components/content/Page";
import { Feed } from '@/components/content/Feed';
import { CollectionPageSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface Params {
  category: string;
}

export async function generateStaticParams() {
  const categories = getWikiCategories();
  return categories.map(category => ({ category }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<Params> 
}): Promise<Metadata> {
  const { category } = await params;
  const categoryMeta = CATEGORIES[category] ?? { name: category };
  const articlesInCategory = getAllWikiCategory(category);
  
  const categoryName = typeof categoryMeta === 'string' 
    ? categoryMeta 
    : categoryMeta.name;
  
  const categoryDescription = typeof categoryMeta === 'object' && categoryMeta.description
    ? categoryMeta.description
    : `Explore artigos sobre ${categoryName}`;

  const articleCount = articlesInCategory.length;

  return {
    title: `${categoryName} | Wiki | Euaggelion`,
    description: `${categoryDescription}. ${articleCount} ${articleCount === 1 ? 'conteúdo disponível' : 'conteúdos disponíveis'}.`,
    keywords: [categoryName, "wiki", "teologia", "cristianismo"],
    openGraph: {
      title: `${categoryName} | Wiki | Euaggelion`,
      description: categoryDescription,
      type: 'website',
      url: `https://euaggelion.com.br/wiki/${category}`,
      siteName: "Euaggelion",
      locale: "pt_BR",
      images: [
        {
          url: "https://euaggelion.com.br/og-image.png",
          width: 1200,
          height: 630,
          alt: categoryName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} | Wiki | Euaggelion`,
      description: categoryDescription,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    alternates: {
      canonical: `https://euaggelion.com.br/wiki/${category}`,
    },
  };
}

interface WikiCategoryPageProps {
  params: Promise<Params>;
}

export default async function WikiCategoryPage({ params }: WikiCategoryPageProps) {
    const { category } = await params;
    const categoryMeta = CATEGORIES[category] ?? { name: category };
    const articlesInCategory = getAllWikiCategory(category).map(article => ({...article}));
    
    const categoryName = typeof categoryMeta === 'string' 
      ? categoryMeta 
      : categoryMeta.name;
    
    const categoryDescription = typeof categoryMeta === 'object' && categoryMeta.description
      ? categoryMeta.description
      : `Explore artigos sobre ${categoryName}`;
  
  return(
        <>
          {/* Schema estruturado */}
          <CollectionPageSchema
            name={categoryName}
            description={categoryDescription}
            url={`https://euaggelion.com.br/wiki/${category}`}
            itemCount={articlesInCategory.length}
          />
          
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Wiki", href: "/wiki" },
              { label: categoryName, href: `/wiki/${category}` },
            ]}
            className="sticky top-14 z-[600] bg-secondary"
          />
          
          <Page.Root>
            <Page.Header variant="wiki">
                <Page.Title content={categoryMeta.name} />
                {categoryMeta.description && (
                <Page.Description content={categoryMeta.description} />
                )}
            </Page.Header>
            <Page.Content>
              <Feed.Root articles={articlesInCategory} category="wiki">
                <Feed.Group>
                  <Feed.Articles category="wiki" isCategoryPage={true} />
                </Feed.Group>
                <Feed.Pagination />
              </Feed.Root>
            </Page.Content> 
        </Page.Root>
        </>
  )
}