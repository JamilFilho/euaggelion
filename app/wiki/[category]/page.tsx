import type { Metadata } from 'next';
import { getAllWikiCategory, getWikiCategories } from "@/lib/getWiki";
import { CATEGORIES } from "@/lib/categories";
import { Page } from "@/components/content/Page";
import { Feed } from '@/components/content/Feed';

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
    openGraph: {
      title: `${categoryName} | Wiki | Euaggelion`,
      description: categoryDescription,
      type: 'website',
      url: `https://euaggelion.com.br/wiki/${category}`,
    },
    twitter: {
      card: 'summary',
      title: `${categoryName} | Wiki | Euaggelion`,
      description: categoryDescription,
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
  
  return(
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
  )
}