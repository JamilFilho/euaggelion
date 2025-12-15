import type { Metadata } from 'next';
import { getArticlesByCategory } from "@/lib/getArticles";
import { CATEGORIES } from "@/lib/categories";
import { CategoryArticles } from "@/components/content/categoryArticles";
import { Page } from "@/components/content/Page";

interface Params {
  category: string;
}

export async function generateStaticParams() {
  const articles = getArticlesByCategory();
  const categories = Array.from(new Set(articles.map(a => a.category)));
  return categories.map(category => ({ category }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<Params> 
}): Promise<Metadata> {
  const { category } = await params;
  const categoryMeta = CATEGORIES[category] ?? { name: category };
  const articlesInCategory = getArticlesByCategory(category);
  
  const categoryName = typeof categoryMeta === 'string' 
    ? categoryMeta 
    : categoryMeta.name;
  
  const categoryDescription = typeof categoryMeta === 'object' && categoryMeta.description
    ? categoryMeta.description
    : `Explore artigos sobre ${categoryName}`;

  const articleCount = articlesInCategory.length;

  return {
    title: `${categoryName} | Euaggelion`,
    description: `${categoryDescription}. ${articleCount} ${articleCount === 1 ? 'conteúdo disponível' : 'conteúdos disponíveis'}.`,
    openGraph: {
      title: categoryName,
      description: categoryDescription,
      type: 'website',
      url: `https://euaggelion.com.br/s/${category}`,
    },
    twitter: {
      card: 'summary',
      title: categoryName,
      description: categoryDescription,
    },
    alternates: {
      canonical: `https://euaggelion.com.br/s/${category}`,
    },
  };
}

interface CategoryPageProps {
  params: Promise<Params>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryMeta = CATEGORIES[category] ?? { name: category };
  const articlesInCategory = getArticlesByCategory(category);

  return (
    <Page.Root>
      <Page.Header>
        <Page.Title content={categoryMeta.name} />
        {categoryMeta.description && (
          <Page.Description content={categoryMeta.description} />
        )}
      </Page.Header>
      <Page.Content>
        <CategoryArticles articles={articlesInCategory} category={category} />
      </Page.Content>
    </Page.Root>
  );
}