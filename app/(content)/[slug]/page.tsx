import React, { cache } from "react";
import Markdoc from "@markdoc/markdoc";
import { notFound } from "next/navigation";
import { createReader } from "@keystatic/core/reader";
import { slugify, collections } from "@/lib/utils";
import keystaticConfig from "../../../keystatic.config";
import { getReadingTime } from "@/lib/timeReader";
import { Article } from "@/components/content/Article";
import { Author } from "@/components/content/Author";
import Link from "next/link";
import BibliaLink from "@/components/content/Bible/BibliaLink";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Metadata } from "next";
import { ArticleSchema, BreadcrumbSchema } from "@/lib/schema";

interface DictionaryProps {
  entry: string;
  children: React.ReactNode;
}

const dictionarySchema = {
  render: 'Dictionary',
  children: ['inline'],
  attributes: {
    entry: {
      type: String,
      required: true,
    },
  },
};

function Dictionary({ entry, children }: DictionaryProps) {
  return (
    <span 
      className="dictionary-term"
      data-entry={entry}
      title={`Verbete: ${entry}`}
    >
      {children}
    </span>
  );
}

const reader = createReader(process.cwd(), keystaticConfig);

async function getAllSlugs() {
  const slugs = new Set<string>();

  for (const collectionName of collections) {
    try {
      const items = await reader.collections[collectionName].all();
      items.forEach((item) => {
        slugs.add(item.slug);
      });
    } catch {
      continue;
    }
  }

  return Array.from(slugs);
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

const getPostBySlug = cache(async (slug: string) => {
  for (const collectionName of collections) {
    try {
      const post = await reader.collections[collectionName].read(slug);
      if (post) {
        return post;
      }
    } catch {
      continue;
    }
  }

  throw new Error(`Artigo com slug "${slug}" não encontrado em nenhuma collection.`);
});

interface Params {
  slug: string;
}

export async function generateMetadata({params}: {params: Promise<Params>}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPostBySlug(slug);
  const category = article?.category ? await reader.collections.categories.read(article.category) : null;

  if (!article) {
    return {
      title: "Artigo não encontrado | Euaggelion",
      description: "O artigo solicitado não foi encontrado.",
    };
  }

  return {
    title: `${article.title} | ${category?.name || article.category} | Euaggelion`,
    description: article.description,
    keywords: article.tags?.join(', '),
    authors: article.author ? [{ name: article.author }] : [{ name: "Euaggelion" }],
    category: article.category,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date ?? undefined,
      modifiedTime: article.date ?? undefined,
      authors: article.author ? [article.author] : ["Euaggelion"],
      tags: article.tags?.filter((tag): tag is string => tag !== null) ?? undefined,
      url: `https://euaggelion.com.br/${slug}`,
      // images: [
      //   {
      //     url: `https://euaggelion.com.br/api/og?slug=${slug}`,
      //     width: 1200,
      //     height: 630,
      //     alt: article.title,
      //     type: "image/png",
      //   },
      // ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      creator: article.author || "@euaggelion",
      // images: [`https://euaggelion.com.br/api/og?slug=${slug}`],
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
      canonical: `https://euaggelion.com.br/${slug}`,
    }
  };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const author = post?.author ? await reader.collections.authors.read(post.author) : null;
  const category = post?.category ? await reader.collections.categories.read(post.category) : null;

  if (!post) {
    return notFound();
  }

  const { node } = await post.content();
  const config = {
    tags: {
      Dictionary: dictionarySchema,
    },
  };
  const errors = Markdoc.validate(node, config);

  if (errors.length) {
    throw new Error('Invalid content');
  }

  const renderable = Markdoc.transform(node, config);
  const readingTime = getReadingTime(Markdoc.renderers.html(renderable));

  // Componentes personalizados do Markdoc
  const components = {
    Dictionary: Dictionary,
  };

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.description}
        // imageUrl={`https://euaggelion.com.br/api/og?slug=${slug}`}
        datePublished={post.date || ""}
        authorName={post.author || ""}
        url={`https://euaggelion.com.br/${slug}`}
        category={category?.name || post.category || ""}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://euaggelion.com.br" },
          { name: category?.name || "", url: `https://euaggelion.com.br/s/${slugify(post.category || "")}` },
          { name: post.title, url: `https://euaggelion.com.br/${slug}` },
        ]}
      />
      
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: category?.name || "", href: `/s/${slugify(category?.name || "")}` },
          { label: post.title, href: `/p/${slug}` },
        ]}
        sticky={true}
        className=""
      />

      <Article.Root>
          <Article.Header>
            <div className="md:w-2/3 md:mx-auto px-10 py-20 space-y-4">
              {category && (
                <Link 
                  className="w-fit py-1 px-2 text-background bg-accent mb-2 font-bold"
                  href={`/s/${post.category}`}
                  title={category?.name}
                >
                  {category?.name}
                </Link>
              )}
              <Article.Title content={post.title} />
              <Article.Description content={post.description} />
            </div>

            <Article.Meta>
              <Article.PublishedAt content={post.date ?? ""} />
              <Article.ReadTime content={readingTime} />
            </Article.Meta>
          </Article.Header>

          <Article.Content>
            <BibliaLink>
              {Markdoc.renderers.react(renderable, React, { components })}
            </BibliaLink>
          </Article.Content>

          <Article.Tags tags={post?.tags?.filter((tag): tag is string => tag !== null) ?? []} />

          <Author.Root>
            <Author.Avatar content={author?.name ?? ""} />
            <Author.Meta name={author?.name ?? ""} bio={author?.bio ?? ""} />
            <Author.Footer content={author?.name ?? ""} />
          </Author.Root>

          <Article.Footer> 
            <Article.Actions
              excerpt={post.description}
              link={`https://euaggelion.com.br/${slugify(post.title)}`}
              headline={post.title}
            />
          </Article.Footer>

          {/* <Article.Related currentSlug={slug} /> */}
      </Article.Root>
    </>
  );
}