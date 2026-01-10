import { getAllWikiCategory } from "@/lib/getWiki";
import { CATEGORIES } from "@/lib/categories";
import { Page } from "@/components/content/Page";
import { Metadata } from "next";
import { Feed } from "@/components/content/Feed";

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
  const publishedArticles = getAllWikiCategory();
  const categories = Array.from(
    new Set(publishedArticles.map(a => a.category).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const articles = categories.map((category) => ({
    slug: category,
    title: CATEGORIES[category]?.name || category,
    description: CATEGORIES[category]?.description || "",
    category,
    isWiki: true,
  }));

    const category = "wiki"
    
    return(
        <Page.Root>
            <Page.Content>
                <Feed.Root articles={articles} category={category}>
                    <Feed.Group>
                      <Feed.Articles category={category} />
                    </Feed.Group>
                    <Feed.Pagination />
                </Feed.Root>
            </Page.Content>
        </Page.Root>
    )
}