import { Metadata } from "next";
import { Feed } from "@/components/content/Feed";
import { Page } from "@/components/content/Page";
import Breadcrumb from "@/components/ui/breadcrumb";
import keystaticConfig from "@/keystatic.config";
import { CollectionPageSchema } from "@/lib/schema";
import { createReader } from "@keystatic/core/reader";

export const metadata: Metadata = {
    title: "Autores | Euaggelion",
    description: "Conheça os autores que contribuem com conteúdo para o Euaggelion e explore seus artigos publicados.",
    keywords: ["autores", "escritores", "contribuintes", "artigos", "euaggelion"],
    openGraph: {
        title: "Autores | Euaggelion",
        description: "Conheça os autores que contribuem com conteúdo para o Euaggelion e explore seus artigos publicados.",
        url: "https://euaggelion.com.br/autores/",
        type: 'website',
        siteName: "Euaggelion",
        locale: "pt_BR",
        images: [
            {
                url: "https://euaggelion.com.br/og-image.png",
                width: 1200,
                height: 630,
                alt: "Autores - Euaggelion",
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Autores | Euaggelion",
        description: "Conheça os autores que contribuem com conteúdo",
    },
    robots: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
    },
    alternates: {
        canonical: "https://euaggelion.com.br/autores/",
    },
};

const reader = createReader(process.cwd(), keystaticConfig);

export default async function AuthorsPage() {
    const authorsData = await reader.collections.authors.all();

    const authors = authorsData.map(author => ({
        slug: author.slug,
        title: author.entry.name,
        description: author.entry.bio,
        category: "authors"
    }));

    return(
        <>
            <CollectionPageSchema
                name="Autores | Euaggelion"
                description="Conheça os autores que contribuem com conteúdo para o Euaggelion e explore seus artigos publicados."
                url="https://euaggelion.com.br/autores/"
                itemCount={authorsData.length}
            />
            <Breadcrumb
                items={[
                { label: "Home", href: "/" },
                { label: "Autores", href: "/autores" },
                ]}
                sticky={true}
                topOffset={0}
            />
            <Page.Root>
                <Page.Header>
                    <Page.Title content="Autores" />
                    <Page.Description content="Conheça os autores que contribuem com conteúdo para o Euaggelion" />
                </Page.Header>

                <Page.Content>
                    <Feed.Root articles={authors} category="authors">
                        <Feed.Group>
                            <Feed.Articles category="authors" />
                        </Feed.Group>
                        <Feed.Pagination />
                    </Feed.Root>
                </Page.Content>
            </Page.Root>
        </>
    )
}