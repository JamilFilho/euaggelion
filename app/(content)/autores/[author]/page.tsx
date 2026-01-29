import { Page } from "@/components/content/Page";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../../../keystatic.config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { slugify, collections, isPublished} from "@/lib/utils";
import { Feed } from "@/components/content/Feed";
import { BreadcrumbSchema, CollectionPageSchema } from "@/lib/schema";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Facebook, Globe, Instagram, Twitter } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const reader = createReader(process.cwd(), keystaticConfig);

export async function generateStaticParams() {
  const authors = await reader.collections.authors.all();
  return authors.map((author) => ({
    author: author.slug,
  }));
}

async function getAuthorPublications(authorSlug: string) {
  const publications = [];

  for (const collectionName of collections) {
    try {
      const items = await reader.collections[collectionName].all();

      const filteredItems = items.filter((item) => {
        const itemAuthorSlug = slugify(item.entry.author || '');
        const date = item.entry.date ?? undefined;

        return itemAuthorSlug === authorSlug && isPublished(date);
      });

      publications.push(...filteredItems);
    } catch {
      continue;
    }
  }

  return publications;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ author: string }> 
}): Promise<Metadata> {
  const { author: slug } = await params;
  const author = await reader.collections.authors.read(slug);

  if (!author) {
    return {
      title: "Autor não encontrado | Euaggelion",
      description: "O autor solicitado não foi encontrado.",
    };
  }

  return {
    title: `${author.name} | Euaggelion`,
    description: author.bio || `Leia os artigos escritos por ${author.name}`,
    keywords: [author.name, "autor", "escritor", "euaggelion"],
    authors: [{ name: author.name }],
    openGraph: {
      title: `${author.name} | Euaggelion`,
      description: author.bio || `Leia os artigos escritos por ${author.name}`,
      type: 'profile',
      url: `https://euaggelion.com.br/autores/${slugify(author.name)}`,
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
      description: author.bio || `Leia os artigos escritos por ${author.name}`,
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
      canonical: `https://euaggelion.com.br/autores/${slugify(author.name)}`,
    }
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ author: string }> }) {
    const { author } = await params;
    const authorData = await reader.collections.authors.read(author);
    if (!authorData) {
        notFound();
    }
    const authorPublications = await getAuthorPublications(author);

    const articles = authorPublications.map((pub) => ({
        slug: pub.slug,
        title: pub.entry.title,
        description: pub.entry.description,
        category: pub.entry.category || 'articles',
        author: pub.entry.author ?? undefined,
        date: pub.entry.date ?? undefined,
    }));

    return(
        <>
            <CollectionPageSchema
                name={authorData?.name || ""}
                description={authorData?.bio || `Artigos escritos por ${authorData?.name}`}
                url={`https://euaggelion.com.br/autores/${author}`}
                itemCount={authorPublications.length}
            />
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "https://euaggelion.com.br" },
                    { name: "Autores", url: "https://euaggelion.com.br/autores" },
                    { name: authorData?.name || "", url: `https://euaggelion.com.br/autores/${author}` },
                ]}
            />
            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Autores", href: "/autores" },
                    { label: authorData?.name || "", href: `/autores/${author}` },
                ]}
                sticky={true}
                className=""
            />
            <Page.Root>
                <Page.Header variant="center">
                    <Avatar className="w-32 h-32">
                        <AvatarImage src={`/images/avatars/${slugify(authorData?.name || "")}/photo.jpeg`} />
                        <AvatarFallback>
                            <Skeleton className="h-32 w-32 rounded-full" />
                        </AvatarFallback>
                    </Avatar>
                    <Page.Title content={authorData?.name || ""} />
                    <div className="md:w-2/3">
                        <Page.Description content={authorData?.bio || `Artigos escritos por ${authorData?.name}`} />
                    </div>
                </Page.Header>

                {authorData?.site || authorData?.twitter || authorData?.facebook || authorData?.instagram ? (
                    <ul className="w-full border-t border-ring/20 grid grid-cols-2 md:grid-cols-4 *:w-full">
                        {(() => {
                            const linkItems = [];
                            if (authorData.site) linkItems.push({ type: 'site', href: authorData.site, label: 'Site pessoal', icon: Globe });
                            if (authorData.facebook) linkItems.push({ type: 'facebook', href: authorData.facebook, label: 'Facebook', icon: Facebook });
                            if (authorData.instagram) linkItems.push({ type: 'instagram', href: `https://instagram.com/${authorData.instagram}`, label: `@${authorData.instagram}`, icon: Instagram });
                            if (authorData.twitter) linkItems.push({ type: 'twitter', href: `https://twitter.com/${authorData.twitter}`, label: `@${authorData.twitter}`, icon: Twitter });
                            const total = linkItems.length;
                            return linkItems.map((item, index) => {
                                const isLast = index === total - 1;
                                const mobileSpan = (isLast && total % 2 === 1) ? 'col-span-2' : 'col-span-1';
                                const desktopSpan = isLast ? `md:col-span-${5 - total}` : 'md:col-span-1';
                                return (
                                    <li key={item.type} className={`${mobileSpan} ${desktopSpan}`}>
                                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex flex-row gap-2 items-center justify-center p-4 border-b border-ring/20 border-r md:border-b-0 hover:bg-black/20 transition-colors ease-in-out">
                                            <item.icon className="size-4" />
                                            {item.label}
                                        </a>
                                    </li>
                                );
                            });
                        })()}
                    </ul>
                ): null}

                <Page.Content>
                    {authorPublications.length > 0 ? (
                    <Feed.Root articles={articles} category="authors">
                        <Feed.Header 
                            show={true}
                            allowDateFilter={true}
                            allowAuthorFilter={false}
                        />
                        <Feed.Group>
                            <Feed.Articles category="article" />
                        </Feed.Group>
                        <Feed.Pagination />
                    </Feed.Root>
                    ):(
                        <div className="border-b border-t border-ring/20 text-center p-20">Nenhuma publicação encontrada para este autor.</div>
                    )}
                </Page.Content>
            </Page.Root>
        </>
    )
}