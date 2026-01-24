import React, { cache } from "react";
import Markdoc from "@markdoc/markdoc";
import Link from "next/link";
import keystaticConfig from "@/keystatic.config";
import { Article } from "@/components/content/Article";
import BibliaLink from "@/components/content/Bible/BibliaLink";
import { wiki } from "@/lib/utils";
import { createReader } from "@keystatic/core/reader";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Metadata } from "next";

const reader = createReader(process.cwd(), keystaticConfig);

const getPostBySlug = cache(async (slug: string) => {
  for (const collectionName of wiki) {
    try {
      const post = await reader.collections[collectionName].read(slug);
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
    description: `O que é ${article.title}? Estude seobre o tema no Glossário WikiGelion`,
    authors: [{name: "Euaggelion"}],
    category: article.category,
    openGraph: {
      title: article.title,
      description: `O que é ${article.title}? Estude seobre o tema no Glossário WikiGelion`,
      type: 'article',
      publishedTime: article.date ?? undefined,
      modifiedTime: article.date ?? undefined,
      authors: ["Euaggelion"],
      url: `https://euaggelion.com.br/wiki/glossario/${slug}`,
      images: [
        {
          url: `https://euaggelion.com.br/api/og?slug=${slug}`,
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
      description: `O que é ${article.title}? Estude seobre o tema no Glossário WikiGelion`,
      creator: "@euaggelion",
      images: [`https://euaggelion.com.br/api/og?slug=${slug}`],
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
      canonical: `https://euaggelion.com.br/wiki/glossario/${slug}`,
    }
  };
}

export default async function GlossaryEntry({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    const category = post?.category ? await reader.collections.categories.read(post.category) : null;

    if (!post) {
        return notFound();
      }
    
    const content = typeof post.content === 'function' ? await post.content() : post.content;
    const { node } = content;
    const errors = Markdoc.validate(node);
    
    if (errors.length) {
        throw new Error('Invalid content');
    }
      
    const renderable = Markdoc.transform(node);

    return(
        <>
        <Breadcrumb
            items={[
                { label: "Home", href: "/" },
                { label: "Wiki", href: "/wiki" },
                { label: "Glossário", href: "/wiki/glossario" },
                { label: post.title, href: `/wiki/glossario/${slug}` },
            ]}
            sticky={true}
            className=""
        />
        <Article.Root>
            <Article.Header>
                <div className="px-10 py-20">
                    <Article.Title content={post.title} />
                </div>
            </Article.Header>

            <Article.Content>
                <BibliaLink>
                    {Markdoc.renderers.react(renderable, React)}
                </BibliaLink>
            </Article.Content>

            <Article.Footer className="mt-12"> 
                <Article.Actions
                    excerpt={post.title}
                    link={`https://euaggelion.com.br/wiki/glossario/${slug}`}
                    headline={post.title}
                />
            </Article.Footer>

            {/* <Article.Related currentSlug={slug} /> */}
        </Article.Root>
        </>
    )
}