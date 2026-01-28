import React, { cache } from "react";
import Markdoc from "@markdoc/markdoc";
import { notFound } from "next/navigation";
import { createReader } from "@keystatic/core/reader";
import { slugify, wiki } from "@/lib/utils";
import keystaticConfig from "@/keystatic.config";
import { getReadingTime } from "@/lib/timeReader";
import { Article } from "@/components/content/Article";
import Link from "next/link";
import BibliaLink from "@/components/content/Bible/BibliaLink";
import { draftMode } from "next/headers";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Metadata } from "next";
import { reader } from "@/lib/reader";

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

async function getAllSlugs() {
  const readerInstance = await reader();
  const slugs: { category: string; slug: string }[] = [];

  for (const collectionName of wiki) {
    try {
      const items = await readerInstance.collections[collectionName].all();
      for (const item of items) {
        const post = await readerInstance.collections[collectionName].read(item.slug);
        if (post && post.category) {
          slugs.push({
            category: slugify(post.category),
            slug: item.slug,
          });
        }
      }
    } catch (error) {
      continue;
    }
  }

  return slugs;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  // Generate only the first 10 pages at build time
  return slugs.slice(0, 10);
}

// Allow generation of pages not in generateStaticParams on demand
export const dynamicParams = true;

// Enable Incremental Static Regeneration every hour
export const revalidate = 3600;

const getPostBySlug = cache(async (slug: string) => {
  const readerInstance = await reader();
  for (const collectionName of wiki) {
    try {
      const post = await readerInstance.collections[collectionName].read(slug);
      if (post) {
        return post;
      }
    } catch (error) {
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
  const readerInstance = await reader();
  const article = await getPostBySlug(slug);
  const category = article?.category ? await readerInstance.collections.categories.read(article.category) : null;

  if (!article) {
    return {
      title: "Artigo não encontrado | Euaggelion",
      description: "O artigo solicitado não foi encontrado.",
    };
  }

  const description = 'description' in article ? article.description : 'Descrição não disponível';
  const related = 'related' in article ? article.related : ('tags' in article ? article.tags : []);

  return {
    title: `${article.title} | ${category?.name || article.category} | Euaggelion`,
    description,
    keywords: related?.join(', '),
    authors: [{ name: "Euaggelion" }],
    category: article.category,
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      publishedTime: article.date ?? undefined,
      modifiedTime: article.date ?? undefined,
      authors: [ "Euaggelion" ],
      tags: related?.filter((tag): tag is string => tag !== null) ?? undefined,
      url: `https://euaggelion.com.br/wiki/${article.category}/${slug}`,
      images: [
        {
          url: `/images/thumbnails/${slug}/thumbnail.jpg`,
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
      description,
      creator: "@euaggelion",
      images: [`/images/thumbnails/${slug}/thumbnail.jpg`],
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
      canonical: `https://euaggelion.com.br/wiki/${category}/${slug}`,
    }
  };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const readerInstance = await reader();
  const category = post?.category ? await readerInstance.collections.categories.read(post.category) : null;
  const isDraft = (await draftMode()).isEnabled;

  if (!post) {
    return notFound();
  }

  const content = typeof post.content === 'function' ? await post.content() : post.content;
  const { node } = content;
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
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Wiki", href: "/wiki" },
          { label: category?.name || "", href: `/wiki/${slugify(category?.name || "")}` },
          { label: post.title, href: `/p/${slug}` },
        ]}
        sticky={true}
        className=""
      />

      {isDraft && (
        <div className="bg-yellow-500 text-black text-center py-2 font-bold">
          MODO RASCUNHO - Visualizando conteúdo não publicado
        </div>
      )}

      <Article.Root>
          <Article.Header>
            <div className="md:w-2/3 md:mx-auto px-10 py-20 space-y-4">
              {category && (
                <Link 
                  className="w-fit py-1 px-2 text-background bg-accent mb-2 font-bold"
                  href={`/wiki/${slugify(category?.name || "")}`}
                  title={category?.name}
                >
                  {category?.name}
                </Link>
              )}
              <Article.Title content={post.title} />
              <Article.Description content={'description' in post ? post.description : 'Descrição não disponível'} />
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

          <Article.Tags tags={('related' in post ? post.related : ('tags' in post ? post.tags : []))?.filter((tag): tag is string => tag !== null) ?? []} />

          <Article.Footer className="mt-12"> 
            <Article.Actions
              excerpt={'description' in post ? post.description ?? '' : ''}
              link={`https://euaggelion.com.br/${slugify(post.title)}`}
              headline={post.title}
            />
          </Article.Footer>

          {/* <Article.Related currentSlug={slug} /> */}
      </Article.Root>
    </>
  );
}