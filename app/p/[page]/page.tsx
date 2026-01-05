import { getAllPages, getPageBySlug } from "@/lib/getPages";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Article } from "@/components/content/Article";
import { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";

import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

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
  page: string;
}

export async function generateStaticParams() {
  const pages = getAllPages();
  
  return pages
    .filter(page => page.published)
    .map((page) => ({
      page: page.slug,
    }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<Params> 
}): Promise<Metadata> {
  const { page: pageSlug } = await params;
  const page = getPageBySlug(pageSlug);

  if (!page) {
    return {
      title: "Página não encontrada",
    };
  }

  return {
    title: `${page.title} | Euaggelion`,
    description: page.description,
    keywords: page.title.split(' ').slice(0, 5),
    openGraph: {
      title: `${page.title} | Euaggelion`,
      description: page.description,
      type: 'website',
      url: `https://euaggelion.com.br/p/${page.slug}`,
      siteName: "Euaggelion",
      locale: "pt_BR",
      images: [
        {
          url: "https://euaggelion.com.br/og-image.png",
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.title} | Euaggelion`,
      description: page.description,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    alternates: {
      canonical: `https://euaggelion.com.br/p/${page.slug}`,
    },
  };
}

export default async function StaticPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { page: pageSlug } = await params;
  
  const page = getPageBySlug(pageSlug);
  
  if (!page) {
    notFound();
  }

  // Usa o nome real do arquivo
  const filePath = path.join(process.cwd(), "content", "pages", page.fileName);
  
  // Verifica se o arquivo existe
  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${filePath}`);
    notFound();
  }
  
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(fileContent);
  
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
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: page.title, href: `/p/${page.slug}` },
        ]}
        className="sticky top-0 z-[800] bg-secondary"
      />
      
      <div className="site-page">
      <Article.Root>
        <Article.Header>
          <Article.Group>
            <Article.Title content={page.title} />
            <Article.Description content={page.description} />
          </Article.Group>
        </Article.Header>

        <Article.Content>
          <MDXRemote 
            source={content}
            options={mdxOptions}
          />
        </Article.Content>
      </Article.Root>
      </div>
    </>
  );
}