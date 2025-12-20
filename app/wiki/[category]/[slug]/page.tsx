import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import { Article } from "@/components/content/Article";
import { getWikiSlug, getAllWikiArticles } from "@/lib/getWiki";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CATEGORIES } from '@/lib/categories';

interface WikiPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

interface Params {
    slug:string;
}

export async function generateStaticParams() {
  const articles = getAllWikiArticles();
  
  return articles
    .filter((article) => article.published)
    .map((article) => ({
      category: article.category,
      slug: article.slug,
    }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<Params> 
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getWikiSlug(slug);

  if (!article) {
    return {
      title: "Artigo não encontrado | Euaggelion",
      description: "O artigo solicitado não foi encontrado.",
    };
  }

  const categoryMeta = CATEGORIES[article.category] ?? { name: article.category };
  const categoryName = typeof categoryMeta === 'string' ? categoryMeta : categoryMeta.name;

  return {
    title: `${article.title} | Euaggelion`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: "Euaggelion",
      tags: article.tags,
      url: `https://euaggelion.com.br/wiki/${article.category}/${article.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
    keywords: article.tags,
    authors: [{ name: "Euaggelions", url: "https://euaggelion.com.br" }],
    category: categoryName,
  };
}

export default async function WikiPage({ params }: WikiPageProps) {
  const { slug, category } = await params;
  const article = getWikiSlug(slug);
  
  // Verifica se o artigo existe, está publicado e a categoria bate
  if (!article || !article.published || article.category !== category) {
    notFound();
  }
  
  return (
    <Article.Root>
      <Article.Header variant="wiki">
        <Article.Group>
          <Article.Title content={article.title} variant="wiki" />
        </Article.Group>
      </Article.Header>

      <Article.Content>
        <MDXRemote source={article.content} />
      </Article.Content>
      
      <Article.Footer>
        <Article.Actions 
          headline={article.title} 
          excerpt={article.description} 
          link={`/wiki/${article.category}/${article.slug}`}
        />
      </Article.Footer>
    </Article.Root>
  );
}