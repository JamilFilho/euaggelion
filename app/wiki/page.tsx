import { getWikiCategoriesWithCount } from "@/lib/getWiki";
import { CATEGORIES } from "@/lib/categories";
import { Page } from "@/components/content/Page";
import { CategoryArticles } from "@/components/content/categoryArticles";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "WikiGelion | Euaggelion",
  description: "História do cristianismo, glossário teológico e artigos de referência.",
  openGraph: {
    title: "WikiGelion | Euaggelion",
    description: "História do cristianismo, glossário teológico e artigos de referência.",
    url: "https://euaggelion.com.br/wiki/",
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "WikiGelion | Euaggelion",
    description: "História do cristianismo, glossário teológico e artigos de referência.",
  },
  alternates: {
    canonical: "https://euaggelion.com.br/wiki",
  },
};

export default function WikiPage() {
    const categories = getWikiCategoriesWithCount().sort((a, b) => a.category.localeCompare(b.category));
    
    const articles = categories.map(({ category, count }) => ({
        slug: category,
        title: CATEGORIES[category]?.name || category,
        description: CATEGORIES[category]?.description || "",
        category: category,
        isWiki: true,
        count: count,
    }));
    
    return(
        <Page.Root>
            <Page.Content>
                <CategoryArticles articles={articles} category="wiki" />
            </Page.Content>
        </Page.Root>
    )
}