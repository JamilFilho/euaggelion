import type { Metadata } from 'next';
import { getArticlesByCategory } from "@/lib/getArticles";
import { CATEGORIES } from "@/lib/categories";
import { Page } from "@/components/content/Page";
import  { Newsletter } from "@/components/layout/Newsletter";
import { Feed } from '@/components/content/Feed';
import { CollectionPageSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface Params {
  category: string;
}

export async function generateStaticParams() {
  const articles = getArticlesByCategory();
  const categories = Array.from(new Set(articles.map(a => a.category)));
  return categories.map(category => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
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
    keywords: [categoryName, "artigos", "estudos bíblicos", "cristianismo", "teologia"],
    openGraph: {
      title: `${categoryName} | Euaggelion`,
      description: categoryDescription,
      type: 'website',
      url: `https://euaggelion.com.br/s/${category}`,
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
      title: `${categoryName} | Euaggelion`,
      description: categoryDescription,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
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
  
  const categoryName = typeof categoryMeta === 'string' 
    ? categoryMeta 
    : categoryMeta.name;
  
  const categoryDescription = typeof categoryMeta === 'object' && categoryMeta.description
    ? categoryMeta.description
    : `Explore artigos sobre ${categoryName}`;

  return (
    <>
      {/* Schema Estruturado */}
      <CollectionPageSchema
        name={categoryName}
        description={categoryDescription}
        url={`https://euaggelion.com.br/s/${category}`}
        itemCount={articlesInCategory.length}
      />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Seções", href: "/s" },
          { label: categoryName, href: `/s/${category}` },
        ]}
        className="sticky top-0 z-[800] bg-secondary"
      />

      <Page.Root>
      <Page.Header>
        <Page.Title content={categoryMeta.name} />
        {categoryMeta.description && (
          <Page.Description content={categoryMeta.description} />
        )}
      </Page.Header>

      <Page.Content>    
        <Feed.Root articles={articlesInCategory} category={category}>
            <Feed.Header 
                show={true}
                allowDateFilter={category !== "verso-a-verso"}
                allowAuthorFilter={category !== "verso-a-verso"}
            />
            <Feed.Group>
              <Feed.Articles category={category} />
            </Feed.Group>
            <Feed.Pagination />
        </Feed.Root>
      </Page.Content>
      
      <Newsletter.Root>
        <Newsletter.Header>
          <Newsletter.Title content="NewsGelion"/>
          <Newsletter.Headline content="Receba nossos materiais, gratuitamente, em seu e-mail." />
        </Newsletter.Header>
        <Newsletter.Form />
        <Newsletter.Footer />
      </Newsletter.Root>
      </Page.Root>
    </>
  );
}