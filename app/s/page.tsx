import { getArticleCategoriesWithCount } from "@/lib/getArticles";
import { CATEGORIES } from "@/lib/categories";
import { Page } from "@/components/content/Page";
import { Metadata } from "next";
import { Feed } from "@/components/content/Feed";
import { CollectionPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
    title: "Seções | Euaggelion",
    description: "Navegue por nossas seções temáticas de conteúdo cristão e edifique sua fé com artigos, estudos bíblicos e devocionais.",
    keywords: ["categorias", "seções", "artigos", "estudos bíblicos", "devocionais"],
    openGraph: {
        title: "Seções | Euaggelion",
        description: "Navegue por nossas seções temáticas de conteúdo cristão",
        url: "https://euaggelion.com.br/s/",
        type: 'website',
        siteName: "Euaggelion",
        locale: "pt_BR",
        images: [
            {
                url: "https://euaggelion.com.br/og-image.png",
                width: 1200,
                height: 630,
                alt: "Seções - Euaggelion",
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Seções | Euaggelion",
        description: "Navegue por nossas seções temáticas de conteúdo cristão",
    },
    robots: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
    },
    alternates: {
        canonical: "https://euaggelion.com.br/s/",
    },
};

export default function CategoriesPage() {
    const categories = getArticleCategoriesWithCount().sort((a, b) => a.category.localeCompare(b.category));
    
    const articles = categories.map(({ category, count }) => ({
        slug: category,
        title: CATEGORIES[category]?.name || category,
        description: CATEGORIES[category]?.description || "",
        category: category,
        isWiki: false,
        count: count,
    }));

    const category = "articles";
    
    return(
        <>
            <CollectionPageSchema
                name="Seções - Euaggelion"
                description="Navegue por nossas seções temáticas de conteúdo cristão"
                url="https://euaggelion.com.br/s/"
                itemCount={categories.length}
            />
            <Page.Root>
                <Page.Header>
                    <Page.Title content="Seções" />
                    <Page.Description content="Navegue por nossas seções de conteúdos" />
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