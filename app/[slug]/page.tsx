import type { Metadata } from 'next';
import { Article } from "@/components/content/Article";
import { getAllArticles, getArticleBySlug, getArticleNavigation } from "@/lib/getArticles";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";
import { getReadingTime } from "@/lib/timeReader";
import { Newsletter } from '@/components/layout/Newsletter';
import { Webmentions } from '@/components/webMentions';
import { Badge } from '@/components/ui/badge';
import { ArticleSchema, BreadcrumbSchema } from "@/lib/schema";
import { RelatedArticles } from "@/components/content/RelatedArticles";

import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import BibliaLink from '@/components/content/Bible/BibliaLink';
import Breadcrumb from '@/components/ui/breadcrumb';

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
};

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
    keywords: article.tags?.join(', '),
    authors: article.author ? [{ name: article.author }] : [{ name: "Euaggelion" }],
    category: categoryName,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: article.author ? [article.author] : ["Euaggelion"],
      tags: article.tags,
      url: `https://euaggelion.com.br/${article.slug}`,
      images: [
        {
          url: `https://euaggelion.com.br/api/og?slug=${article.slug}`,
          width: 1200,
          height: 630,
          alt: article.title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      creator: article.author || "@euaggelion",
      images: [`https://euaggelion.com.br/api/og?slug=${article.slug}`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    other: {
      'webmention': 'https://webmention.io/euaggelion.com.br/webmention',
      'pingback': 'https://webmention.io/euaggelion.com.br/xmlrpc',
    },
    alternates: {
      canonical: `https://euaggelion.com.br/${article.slug}`,
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

  const filePath = path.join(process.cwd(), "content", "articles", found.category, found.fileName);
  
  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${filePath}`);
    notFound();
  }
  
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(fileContent);
  const categoryMeta = CATEGORIES[found.category] ?? { name: found.category };
  const tags = found.tags;
  const readingTime = getReadingTime(content);
  
  const navigation = getArticleNavigation(slug, found.category);

  const mdxOptions = {
    mdxOptions: {
      remarkPlugins: [
        remarkGfm, // Suporte para tabelas, strikethrough, tasklists, etc.
      ],
      rehypePlugins: [
        rehypeSlug, // Adiciona IDs aos headings
        [
          rehypeAutolinkHeadings,
          headingAutolinkOptions,
        ],
      ],
    },
  };

  return (
    <>
      <ArticleSchema
        title={found.title}
        description={found.description}
        imageUrl={`https://euaggelion.com.br/api/og?slug=${found.slug}`}
        datePublished={found.date}
        authorName={found.author}
        url={`https://euaggelion.com.br/${found.slug}`}
        category={typeof categoryMeta === 'string' ? categoryMeta : categoryMeta.name}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://euaggelion.com.br" },
          { name: typeof categoryMeta === 'string' ? categoryMeta : categoryMeta.name, url: `https://euaggelion.com.br/s/${found.category}` },
          { name: found.title, url: `https://euaggelion.com.br/${found.slug}` },
        ]}
      />

      <Article.Root>
        <Breadcrumb
          className="sticky top-0 left-0"
          items={[
            { label: "Home", href: "/" },
            { label: typeof categoryMeta === 'string' ? categoryMeta : categoryMeta.name, href: `/s/${found.category}` },
            { label: found.title, href: `/${found.slug}` },
          ]} />
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
              <div className="col-span-2 border-b border-r border-ring/20">Publicado por</div>
              <div className="col-span-2 border-b border-ring/20">{found.author}</div>

              <Article.PublishedAt content={found.date} />
              <Article.ReadTime content={readingTime} />

          </Article.Meta>

          {found.reference && found.reference.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4 py-8 px-10 w-full border-t border-foreground/20">
              <span className="text-lg font-semibold text-foreground/60">Leia também:</span>
              <ul className="flex flex-row flex-wrap justify-start gap-2">
                {found.reference.map((ref, index) => (
                  <li key={index}>
                    <BibliaLink variant="link">
                      {ref}
                    </BibliaLink>
                  </li>
                ))}
                </ul>
            </div>
          )}
        </Article.Header>

        <Article.Content>
          <BibliaLink>
            <MDXRemote 
              source={content}
              options={mdxOptions}
            />
          </BibliaLink>
        </Article.Content>
        
        <Article.Footer>
          <Article.Tags tags={tags}/>
          
          <Article.Actions
            excerpt={found.description}
            link={`https://euaggelion.com.br/${found.slug}`}
            headline={found.title}
          />

          <Webmentions target={`https://euaggelion.com.br/${found.slug}`} />

          <RelatedArticles currentSlug={found.slug} />
        </Article.Footer>

        <Newsletter.Root>
          <Newsletter.Header>
            <Newsletter.Title content="NewsGelion"/>
            <Newsletter.Headline content="Gostou deste conteúdo? Inscreva-se gratuitamente e receba materiais como este em seu e-mail." />
          </Newsletter.Header>
          <Newsletter.Form />
          <Newsletter.Footer />
        </Newsletter.Root>
      </Article.Root>
    </>
  );
}