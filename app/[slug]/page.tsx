import type { Metadata } from 'next';
import { Article } from "@/components/content/Article";
import { getAllArticles, getArticleBySlug, getArticleNavigation } from "@/lib/getArticles";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/mdx-components";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";
import { getReadingTime } from "@/lib/timeReader";
import { Newsletter } from '@/components/layout/Newsletter';

interface Params {
  slug: string;
}

export async function generateStaticParams() {
  const articles = getAllArticles();

  return articles
    .filter(article => article.published)
    .map((article) => ({
      slug: article.slug,
    }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<Params> 
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

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
      authors: article.author ? [article.author] : undefined,
      tags: article.tags,
      url: `https://euaggelion.com.br/${article.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
    keywords: article.tags,
    authors: article.author ? [{ name: article.author }] : undefined,
    category: categoryName,
    other: {
      'schema:type': 'Article',
      'schema:author': article.author ? [article.author] : "Euaggelion",
      'schema:datePublished': article.date,
    },
    alternates: {
      canonical: `https://euaggelion.com.br/${article.slug}`
    }
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  
  const found = getArticleBySlug(slug);
  
  if (!found || !found.published || !found.date) {
    notFound();
  }

  const filePath = path.join(process.cwd(), "content", "articles", found.fileName);
  
  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${filePath}`);
    notFound();
  }
  
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(fileContent);
  const components = useMDXComponents({});
  const categoryMeta = CATEGORIES[found.category] ?? { name: found.category };
  const tags = found.tags;
  const readingTime = getReadingTime(content);
  
  const navigation = getArticleNavigation(slug, found.category);

  return (
    <Article.Root>
      <Article.Header>
        <Article.Group>
          <Link 
            className="w-fit py-1 px-2 text-background bg-accent mb-2 font-bold"
            href={`/s/${found.category}`}
            title={typeof categoryMeta === 'string' ? categoryMeta : categoryMeta.name}
          >
            {typeof categoryMeta === 'string' ? categoryMeta : categoryMeta.name}
          </Link>
          <Article.Title content={found.title} />
          <Article.Description content={found.description} />
        </Article.Group>

        <Article.Meta>
            <Article.PublishedAt content={found.date} />
            <Article.ReadTime content={readingTime} />
        </Article.Meta>
      </Article.Header>

      <Article.Content>
        <MDXRemote source={content} components={components} />
      </Article.Content>
      
      <Article.Footer>
        <Article.Tags tags={tags}/>
        <Article.Actions
          excerpt={found.description}
          link={`https://euaggelion.com.br/${found.slug}`}
          headline={found.title}
        />
      </Article.Footer>

      <Newsletter.Root>
        <Newsletter.Header>
          <Newsletter.Title content="NewsGelion"/>
          <Newsletter.Headline content="Gostou deste conteúdo? Inscreva-se gratuitamente e receba materiais como este em seu e-mail." />
        </Newsletter.Header>
        <Newsletter.Form />
        <Newsletter.Footer />
      </Newsletter.Root>

      <Article.Navigation
        prev={navigation.prev}
        next={navigation.next}
        category={found.category}
      />
    </Article.Root>
  );
}