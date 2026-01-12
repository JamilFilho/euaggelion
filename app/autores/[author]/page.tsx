import { StickySection } from "@/components/layout/StickySection"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Breadcrumb from "@/components/ui/breadcrumb"
import { Skeleton } from "@/components/ui/skeleton"
import { getAuthors } from "@/lib/getAuthor"
import { Feed } from "@/components/content/Feed"
import { notFound } from "next/navigation"
import type { Metadata } from 'next'
import { CollectionPageSchema, BreadcrumbSchema } from "@/lib/schema"
import { Page } from "@/components/content/Page"

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ author: string }> 
}): Promise<Metadata> {
  const { author: slug } = await params;
  const authors = getAuthors()
  const author = authors.find(a => a.slug === slug)

  if (!author) {
    return {
      title: "Autor não encontrado | Euaggelion",
      description: "O autor solicitado não foi encontrado.",
    };
  }

  return {
    title: `${author.name} | Euaggelion`,
    description: author.description || `Artigos escritos por ${author.name}`,
    keywords: [author.name, "autor", "escritor", "euaggelion"],
    authors: [{ name: author.name }],
    openGraph: {
      title: `${author.name} | Euaggelion`,
      description: author.description || `Artigos escritos por ${author.name}`,
      type: 'profile',
      url: `https://euaggelion.com.br/autores/${author.slug}`,
      images: [
        {
          url: `https://euaggelion.com.br/og-image.png`,
          width: 1200,
          height: 630,
          alt: author.name,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${author.name} | Euaggelion`,
      description: author.description || `Artigos escritos por ${author.name}`,
      images: [`https://euaggelion.com.br/og-image.png`],
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
    alternates: {
      canonical: `https://euaggelion.com.br/autores/${author.slug}`,
    }
  };
}

const category = "authors";

export default async function AutorPage({ params }: { params: Promise<{ author: string }> }) {
    const { author: slug } = await params;
    const authors = getAuthors()
    const author = authors.find(a => a.slug === slug)

    if (!author) {
        notFound()
    }

    return(
    <>
        <CollectionPageSchema
            name={author.name}
            description={author.description || `Artigos escritos por ${author.name}`}
            url={`https://euaggelion.com.br/autores/${author.slug}`}
            itemCount={author.articles.length}
        />
        <BreadcrumbSchema
            items={[
                { name: "Home", url: "https://euaggelion.com.br" },
                { name: "Autores", url: "https://euaggelion.com.br/autores" },
                { name: author.name, url: `https://euaggelion.com.br/autores/${author.slug}` },
            ]}
        />
        <Breadcrumb
            items={[
                { label: "Home", href: "/" },
                { label: "Autores", href: "/autores" },
                { label: author.name, href: `/autores/${author.slug}` },
            ]}
            sticky={true}
            className=""
        />
        <Page.Root>
            <Page.Header>
                <Avatar className="w-32 h-32">
                    <AvatarImage src={author.avatar} />
                    <AvatarFallback>
                        <Skeleton className="h-32 w-32 rounded-full" />
                    </AvatarFallback>
                </Avatar>
                <Page.Title content={author.name} />
                <div className="md:w-2/3">
                    <Page.Description content={author.description || `Artigos escritos por ${author.name}`} />
                </div>
            </Page.Header>
        </Page.Root>
        <Page.Content>
            <Feed.Root articles={author.articles} category="articles">
                {author.articles .length > 2 && (
                    <Feed.Header 
                    show={true}
                    allowDateFilter={category == "authors"}
                    allowAuthorFilter={false}
                    />
                )}
                <Feed.Group>
                    <Feed.Articles category="articles" />
                </Feed.Group>
                <Feed.Pagination />
            </Feed.Root>
        </Page.Content>
    </>
    )
}