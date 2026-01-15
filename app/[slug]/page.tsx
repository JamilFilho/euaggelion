import type { Metadata } from 'next';
import { Article } from "@/components/content/Article";
import { getAuthors } from "@/lib/getAuthor";
import { getAllArticles, getArticleBySlug, getArticleNavigation } from "@/lib/getArticles";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";
import Image from "next/image";
import { getReadingTime } from "@/lib/timeReader";
import { ArticleSchema, BreadcrumbSchema } from "@/lib/schema";
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { remarkChronologyParser } from '@/lib/remarkChronologyParser';
import { rehypeChronologyParser } from '@/lib/rehypeChronologyParser';
import { remarkTimelineParser } from '@/lib/remarkTimelineParser';
import { rehypeTimelineParser } from '@/lib/rehypeTimelineParser';
import { remarkDictionaryParser } from '@/lib/remarkDictionaryParser';
import { rehypeDictionaryParser } from '@/lib/rehypeDictionaryParser';
import BibliaLink from '@/components/content/Bible/BibliaLink';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Chronology } from '@/components/content/Chronology';
import { ChronologyBlock } from '@/components/content/Chronology/ChronologyBlock';
import { ChronologyProvider } from '@/lib/context/ChronologyContext';
import { TimelineBlock } from '@/components/content/Timeline/TimelineBlock';
import { Poetry } from '@/components/content/Poetry';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import LightboxWrapper from '@/components/LightboxInitializer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import DictionaryLink from '@/components/content/DictionaryLink';

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

function OptimizedImage({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) {
  return (
    <figure className="relative">
      <LightboxWrapper src={src} alt={alt}>
        <Image
          src={src}
          alt={alt || ''}
          width={1200}
          height={630}
          className="w-full h-auto"
          priority={false}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          {...props}
        />
      </LightboxWrapper>
    </figure>
  );
}

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

  const authors = getAuthors();
  const author = found.author ? authors.find(a => a.name === found.author) : null;

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
        remarkChronologyParser,
        remarkTimelineParser,
        remarkDictionaryParser,
        remarkGfm, // Suporte para tabelas, strikethrough, tasklists, etc.
      ],
      rehypePlugins: [
        rehypeChronologyParser,
        rehypeTimelineParser,
        rehypeDictionaryParser,
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
    img: OptimizedImage,
    Poetry: Poetry.Root,
    Stanza: Poetry.Stanza,
    Verse: Poetry.Verse,
    Popover: Popover as any,
    PopoverTrigger: PopoverTrigger as any,
    PopoverContent: PopoverContent as any,
    DictionaryLink: DictionaryLink as any,
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
          sticky={true}
          className=""
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
            <Article.PublishedAt content={found.date} />
            <Article.ReadTime content={readingTime} />

          </Article.Meta>

          {found.reference && found.reference.length > 0 && (
            <div className="py-8 w-full border-t border-foreground/20">
              <div className="md:w-2/3 px-10 md:px-12 md:mx-auto flex flex-col md:flex-row gap-4">
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
            </div>
          )}
        </Article.Header>

        {found.chronology && found.chronology.length > 0 && (
          <ChronologyProvider 
            chronology={found.chronology}
            datasets={found.chronologyDataset}
          >
            <Chronology.Root>
              <Chronology.Timeline />
            </Chronology.Root>
          </ChronologyProvider>
        )}

        <Article.Content>
          <BibliaLink>
            <MDXRemote 
              source={content}
              options={mdxOptions}
              components={mdxComponents}
            />
          </BibliaLink>
        </Article.Content>

        <Article.Tags tags={tags}/>

        {found.author &&(
          <div className="border-t border-ring/20 mt-20">
            <div className="pt-10 md:border-l md:border-r border-ring/20 md:w-3/5 md:mx-auto grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-0">
              <div className="px-10 md:px-0 flex items-center justify-center col-span-1">
                <Avatar className="w-20 h-20">
                    <AvatarImage src={author?.avatar || "/pwa/icon-512x512.png"} />
                    <AvatarFallback>
                        <Skeleton className="h-20 w-20 rounded-full" />
                    </AvatarFallback>
                </Avatar>
              </div>
              <div className="px-10 md:px-0 md:pr-10 col-span-1 md:col-span-4 text-center md:text-left">
                <h3 className="text-2xl font-semibold">{author?.name}</h3>
                <p className="text-foreground/70 mt-2">{author?.description}</p>
              </div>
              <Link href={`/autores/${author?.slug}`} className="mt-10 px-10 py-6 col-span-1 md:col-span-5 text-center bg-black/20 border-t border-ring/20">
                Mais artigos de {author?.name}
              </Link>
            </div>
          </div>
        )}
        
        <Article.Footer> 
          <Article.Actions
            excerpt={found.description}
            link={`https://euaggelion.com.br/${found.slug}`}
            headline={found.title}
          />

          <Article.Related currentSlug={found.slug} />
        </Article.Footer>
      </Article.Root>
    </>
  );
}