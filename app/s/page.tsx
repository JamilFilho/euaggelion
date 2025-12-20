import { getArticleCategoriesWithCount } from "@/lib/getArticles";
import { CATEGORIES } from "@/lib/categories";
import { Page } from "@/components/content/Page";
import { Metadata } from "next";
import { Feed } from "@/components/content/Feed";

export const metadata: Metadata = {
    title: "Seções | Euaggelion",
    description: "Navegue por nossas seções temáticas e edifique sua fé com nossos conteúdos.",
    openGraph: {
        title: "Seções | Euaggelion",
        description: "Navegue por nossas seções temáticas e edifique sua fé com nossos conteúdos.",
        url: "https://euaggelion.com.br/s/",
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: "Seções | Euaggelion",
        description: "Navegue por nossas seções temáticas e edifique sua fé com nossos conteúdos.",
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
        <Page.Root>
            <Page.Header>
                <Page.Title content="Seções" />
                <Page.Description content="Navegue por nossas seções de conteúdos" />
            </Page.Header>
            <Page.Content>
                <Feed.Root articles={articles} category={category}>
                    <Feed.Header show={false} />
                    <Feed.Group>
                        <Feed.Articles category={category} />
                    </Feed.Group>
        
                    <Feed.Pagination />
                </Feed.Root>
            </Page.Content>
        </Page.Root>
    )
}