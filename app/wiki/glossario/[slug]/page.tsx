import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import { Article } from "@/components/content/Article";
import { getWikiSlug, getAllWikiArticles } from "@/lib/getWiki";
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CATEGORIES } from '@/lib/categories';
import { Webmentions } from '@/components/webMentions';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArticleSchema, BreadcrumbSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/breadcrumb";

import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { remarkChronologyParser } from '@/lib/remarkChronologyParser';
import { rehypeChronologyParser } from '@/lib/rehypeChronologyParser';
import { remarkTimelineParser } from '@/lib/remarkTimelineParser';
import { rehypeTimelineParser } from '@/lib/rehypeTimelineParser';
import BibliaLink from '@/components/content/Bible/BibliaLink';
import { ChronologyBlock } from '@/components/content/Chronology/ChronologyBlock';
import { TimelineBlock } from '@/components/content/Timeline/TimelineBlock';

const CATEGORY = "glossario";

const headingLinkIcon = {
  type: 'element',
  tagName: 'svg',
  properties: {
    className: ['heading-link-icon'],
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    width: 18,
    height: 18,
    'aria-hidden': 'true',
    focusable: 'false',
  },
  children: [
    {
      type: 'element',
      tagName: 'path',
      properties: { d: 'M15 7h2a5 5 0 0 1 0 10h-2' },
      children: [],
    },
    {
      type: 'element',
      tagName: 'path',
      properties: { d: 'M9 17H7a5 5 0 0 1 0-10h2' },
      children: [],
    },
    {
      type: 'element',
      tagName: 'line',
      properties: { x1: 8, y1: 12, x2: 16, y2: 12 },
      children: [],
    },
  ],
};

const headingAutolinkOptions = {
  behavior: 'prepend',
  test: ['h2', 'h3', 'h4', 'h5', 'h6'],
  properties: {
    className: ['heading-anchor'],
    'aria-label': 'Copiar link da seção',
  },
  content: [headingLinkIcon],
} as any;

interface WikiPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Params {
    slug: string;
}

export async function generateStaticParams() {
  const articles = getAllWikiArticles();
  
  return articles
    .filter((article) => article.published && article.category === CATEGORY)
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
  const article = getWikiSlug(slug);

  if (!article) {
    return {
      title: "Artigo não encontrado | Euaggelion",
      description: "O artigo solicitado não foi encontrado.",
    };
  }

  const categoryMeta = CATEGORIES[CATEGORY] ?? { name: CATEGORY };
  const categoryName = typeof categoryMeta === 'string' ? categoryMeta : categoryMeta.name;

  return {
    title: `${article.title} | Wiki | Euaggelion`,
    description: article.description,
    keywords: article.tags,
    authors: [{ name: "Euaggelion", url: "https://euaggelion.com.br" }],
    category: categoryName,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: ["Euaggelion"],
      tags: article.tags,
      url: `https://euaggelion.com.br/wiki/${CATEGORY}/${slug}`,
      siteName: "Euaggelion",
      locale: "pt_BR",
      images: [
        {
          url: `https://euaggelion.com.br/api/og?slug=${article.slug}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [`https://euaggelion.com.br/api/og?slug=${slug}`],
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    alternates: {
      canonical: `https://euaggelion.com.br/wiki/${CATEGORY}/${slug}`,
    },
  };
}

export default async function GlossarioArticlePage({ params }: WikiPageProps) {
  const { slug } = await params;
  const article = getWikiSlug(slug);

  const mdxOptions = {
    mdxOptions: {
      remarkPlugins: [
        remarkChronologyParser,
        remarkTimelineParser,
        remarkGfm, // Suporte para tabelas, strikethrough, tasklists, etc.
      ],
      rehypePlugins: [
        rehypeChronologyParser,
        rehypeTimelineParser,
        rehypeSlug, // Adiciona IDs aos headings
        [
          rehypeAutolinkHeadings,
          headingAutolinkOptions,
        ] as any,
      ],
    },
  };

  const mdxComponents = {
    ChronologyBlock: ChronologyBlock as any,
    TimelineBlock: TimelineBlock as any,
  };

  // Verificar se o artigo existe, está publicado e pertence ao glossário
  if (!article || !article.published || article.category !== CATEGORY) {
    notFound();
  }
  
  // Construir caminho do arquivo
  const filePath = path.join(process.cwd(), "content", "wiki", CATEGORY, `${article.slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${filePath}`);
    notFound();
  }
  
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(fileContent);
  
  const categoryMeta = CATEGORIES[CATEGORY] ?? { name: CATEGORY };
  const categoryName = typeof categoryMeta === 'string' ? categoryMeta : categoryMeta.name;
  
  return (
    <>
      {/* Schema estruturado de artigo */}
      <ArticleSchema
        title={article.title}
        description={article.description}
        datePublished={article.date}
        dateModified={article.date}
        imageUrl={`https://euaggelion.com.br/api/og?slug=${slug}`}
        url={`https://euaggelion.com.br/wiki/${CATEGORY}/${slug}`}
      />
      
      {/* Schema de breadcrumbs */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://euaggelion.com.br" },
          { name: "Wiki", url: "https://euaggelion.com.br/wiki" },
          { name: categoryName, url: `https://euaggelion.com.br/wiki/${CATEGORY}` },
          { name: article.title, url: `https://euaggelion.com.br/wiki/${CATEGORY}/${slug}` },
        ]}
      />
      
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Wiki", href: "/wiki" },
          { label: categoryName, href: `/wiki/${CATEGORY}` },
          { label: article.title, href: `/wiki/${CATEGORY}/${slug}` },
        ]}
        sticky={true}
        className=""
      />
      
      <Article.Root>
      <Article.Header>
        <div className="p-10">
          <Article.Title content={article.title} variant="wiki" />
        </div>
      </Article.Header>

      <Article.Content>
        <BibliaLink>
          <MDXRemote 
            source={content}
            options={mdxOptions}
            components={mdxComponents}
          />
        </BibliaLink>
      </Article.Content>
      
      <Article.Footer>
        <Article.Actions 
          headline={article.title} 
          excerpt={article.description} 
          link={`https://euaggelion.com.br/wiki/${CATEGORY}/${slug}`}
        />
      </Article.Footer>
    </Article.Root>
    </>
  );
}