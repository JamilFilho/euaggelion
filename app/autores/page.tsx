import { getAuthors } from "@/lib/getAuthor";
import { Page } from "@/components/content/Page";
import { Metadata } from "next";
import { Feed } from "@/components/content/Feed";
import { CollectionPageSchema } from "@/lib/schema";
import Breadcrumb from "@/components/ui/breadcrumb";

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

export default function AuthorsPage() {
    const allAuthors = getAuthors();
    const authorsWithContent = allAuthors.filter(author => author.articles.length > 0);
    
    const articles = authorsWithContent.map((author) => ({
        slug: author.slug,
        title: author.name,
        description: author.description || `Artigos escritos por ${author.name}`,
        category: "authors",
        isWiki: false,
        count: author.articles.length,
        author: author.name,
    }));

    const category = "authors";
    
    return(
        <>
        <CollectionPageSchema
            name="Autores | Euaggelion"
            description="Conheça os autores que contribuem com conteúdo para o Euaggelion e explore seus artigos publicados."
            url="https://euaggelion.com.br/autores/"
            itemCount={authorsWithContent.length}
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
                <Feed.Root articles={articles} category={category}>
                    <Feed.Group>
                        <Feed.Articles category={category} />
                    </Feed.Group>
                    <Feed.Pagination />
                </Feed.Root>
            </Page.Content>
        </Page.Root>
        </>
    )
}