import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import { Article } from "@/components/content/Article";
import { getWikiSlug, getAllWikiArticles, getWikiSubgroup, getWikiSubgroups } from "@/lib/getWiki";
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CATEGORIES } from '@/lib/categories';
import { COMMENTARIES } from '@/lib/commentaries';
import { Webmentions } from '@/components/webMentions';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArticleSchema, BreadcrumbSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Feed } from '@/components/content/Feed';
import { Page } from '@/components/content/Page';
import { CollectionPageSchema } from "@/lib/schema";

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
    category: string;
    slug: string[];
  }>;
}

interface Params {
    category: string;
    slug: string[];
}

export async function generateStaticParams() {
  const articles = getAllWikiArticles();
  const params: { category: string; slug: string[] }[] = [];
  
  // Adicionar rotas para artigos
  articles
    .filter((article) => article.published)
    .forEach((article) => {
      params.push({
        category: article.category,
        slug: article.slug.split('/'),
      });
    });
  
  // Adicionar rotas para subgrupos
  const categories = [...new Set(articles.map(a => a.category))];
  categories.forEach((category) => {
    const subgroups = getWikiSubgroups(category);
    subgroups.forEach((subgroup) => {
      params.push({
        category,
        slug: [subgroup],
      });
    });
  });
  
  return params;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<Params> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug, category } = resolvedParams;
  const fullSlug = slug.join('/');
  const article = getWikiSlug(fullSlug);

  // Se não é um artigo, pode ser um subgrupo
  if (!article) {
    const subgroupArticles = getWikiSubgroup(category, fullSlug);
    
    if (subgroupArticles.length > 0) {
      // É um subgrupo válido
      const subgroupNameFromSlug = slug[slug.length - 1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const commentaryMeta = COMMENTARIES[fullSlug] ?? { name: subgroupNameFromSlug, description: `Comentários de ${subgroupNameFromSlug}` };
      const subgroupName = commentaryMeta.name;
      const commentaryDescription = commentaryMeta.description ?? `Comentários de ${subgroupName}`;
      
      const categoryMeta = CATEGORIES[category] ?? { name: category };
      const categoryName = typeof categoryMeta === 'string' ? categoryMeta : categoryMeta.name;
      
      return {
        title: `${subgroupName} | ${categoryName} | Wiki | Euaggelion`,
        description: `${commentaryDescription} ${subgroupArticles.length} ${subgroupArticles.length === 1 ? 'comentário disponível' : 'comentários disponíveis'}.`,
        keywords: [subgroupName, categoryName, "comentários bíblicos", "teologia"],
        openGraph: {
          title: `${subgroupName} | ${categoryName}`,
          description: commentaryDescription,
          type: 'website',
          url: `https://euaggelion.com.br/wiki/${category}/${fullSlug}`,
          siteName: "Euaggelion",
          locale: "pt_BR",
        },
        alternates: {
          canonical: `https://euaggelion.com.br/wiki/${category}/${fullSlug}`,
        },
      };
    }
    
    return {
      title: "Artigo não encontrado | Euaggelion",
      description: "O artigo solicitado não foi encontrado.",
    };
  }

  const categoryMeta = CATEGORIES[article.category] ?? { name: article.category };
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
      url: `https://euaggelion.com.br/wiki/${article.category}/${fullSlug}`,
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
      images: [`https://euaggelion.com.br/api/og?slug=${fullSlug}`],
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    alternates: {
      canonical: `https://euaggelion.com.br/wiki/${article.category}/${fullSlug}`,
    },
  };
}

export default async function WikiPage({ params }: WikiPageProps) {
  const { slug, category } = await params;
  const fullSlug = slug.join('/');
  const article = getWikiSlug(fullSlug);

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

  // Se não é um artigo, verificar se é um subgrupo
  if (!article) {
    const subgroupArticles = getWikiSubgroup(category, fullSlug);
    
    if (subgroupArticles.length === 0) {
      notFound();
    }
    
    // Marcar artigos como wiki para URL correta
    const articlesWithWikiFlag = subgroupArticles.map(article => ({
      ...article,
      isWiki: true,
    }));
    
    // Renderizar página de listagem do subgrupo
    const subgroupNameFromSlug = slug[slug.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const commentaryMeta = COMMENTARIES[fullSlug] ?? { name: subgroupNameFromSlug, description: `Comentários de ${subgroupNameFromSlug}` };
    const subgroupName = commentaryMeta.name;
    const commentaryDescription = commentaryMeta.description ?? `Comentários de ${subgroupName}`;
    
    const categoryMeta = CATEGORIES[category] ?? { name: category };
    const categoryName = typeof categoryMeta === 'string' ? categoryMeta : categoryMeta.name;
    
    return (
      <>
        {/* Schema estruturado */}
        <CollectionPageSchema
          name={subgroupName}
          description={commentaryDescription}
          url={`https://euaggelion.com.br/wiki/${category}/${fullSlug}`}
          itemCount={subgroupArticles.length}
        />
        
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Wiki", href: "/wiki" },
            { label: categoryName, href: `/wiki/${category}` },
            { label: subgroupName, href: `/wiki/${category}/${fullSlug}` },
          ]}
          sticky={true}
          className=""
        />
        
        <Page.Root>
          <Page.Header variant="wiki">
            <Page.Title content={subgroupName} />
            <Page.Description content={commentaryDescription} />
          </Page.Header>
          <Page.Content>
            <Feed.Root articles={articlesWithWikiFlag} category="wiki">
              <Feed.Group>
                <Feed.Articles category="wiki" isCategoryPage={true} />
              </Feed.Group>
              <Feed.Pagination />
            </Feed.Root>
          </Page.Content>
        </Page.Root>
      </>
    );
  }

  // Verifica se o artigo está publicado e a categoria bate
  if (!article.published || article.category !== category) {
    notFound();
  }
  
  // Construir caminho do arquivo considerando subpastas
  const slugParts = article.slug.split('/');
  const fileName = slugParts[slugParts.length - 1] + '.mdx';
  const subPath = slugParts.slice(0, -1).join(path.sep);
  const filePath = subPath
    ? path.join(process.cwd(), "content", "wiki", article.category, subPath, fileName)
    : path.join(process.cwd(), "content", "wiki", article.category, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${filePath}`);
    notFound();
  }
  
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(fileContent);
  
  const categoryMeta = CATEGORIES[article.category] ?? { name: article.category };
  const categoryName = typeof categoryMeta === 'string' ? categoryMeta : categoryMeta.name;
  
  return (
    <>
      {/* Schema estruturado de artigo */}
      <ArticleSchema
        title={article.title}
        description={article.description}
        datePublished={article.date}
        dateModified={article.date}
        imageUrl={`https://euaggelion.com.br/api/og?slug=${fullSlug}`}
        url={`https://euaggelion.com.br/wiki/${article.category}/${fullSlug}`}
      />
      
      {/* Schema de breadcrumbs */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://euaggelion.com.br" },
          { name: "Wiki", url: "https://euaggelion.com.br/wiki" },
          { name: categoryName, url: `https://euaggelion.com.br/wiki/${article.category}` },
          { name: article.title, url: `https://euaggelion.com.br/wiki/${article.category}/${fullSlug}` },
        ]}
      />
      
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Wiki", href: "/wiki" },
          { label: categoryName, href: `/wiki/${category}` },
          { label: article.title, href: `/wiki/${category}/${fullSlug}` },
        ]}
        sticky={true}
        className=""
      />
      
      <Article.Root>
      <Article.Header variant="wiki">
        <Article.Group>
          {article.status && (
            <Badge className="w-fit" variant="destructive">{article.status}</Badge>
          )}
          <Article.Title content={article.title} variant="wiki" />
          <Article.Description content={article.description}/>
        </Article.Group>

        <Article.Meta>
          {article.related && article.related.length > 0 && (
            <>
              <div className="col-span-2 items-center border-r border-ring/20">
                <p className="text-lg font-semibold">Tópicos</p>
              </div>
              <ul className="px-4 col-span-2 flex flex-row !justify-start items-start flex-wrap gap-2">
                {article.related.map((relatedCategory) => {
                  
                  const categoryInfo = CATEGORIES[relatedCategory];
                  const categoryName = typeof categoryInfo === 'string' ? categoryInfo : categoryInfo?.name ?? relatedCategory;                  

                  return (
                    <li key={relatedCategory}>
                      <Link href={`/wiki/${relatedCategory}`} title={categoryName}>
                        <Badge>
                          {categoryName}
                        </Badge>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </Article.Meta>
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
          link={`https://euaggelion.com.br/wiki/${article.category}/${fullSlug}`}
        />

        <Webmentions target={`https://euaggelion.com.br/wiki/${article.category}/${fullSlug}`} />

        <Article.Related currentSlug={article.slug} includeWiki={true} />
      </Article.Footer>
    </Article.Root>
    </>
  );
}