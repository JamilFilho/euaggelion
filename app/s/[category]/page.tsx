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