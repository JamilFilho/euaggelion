import { getAllWikiCategory } from "@/lib/getWiki";
import { CATEGORIES } from "@/lib/categories";
import { Page } from "@/components/content/Page";
import { Metadata } from "next";
import { Feed } from "@/components/content/Feed";
import { CollectionPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "WikiGelion | Euaggelion",
  description: "História do cristianismo, glossário teológico e artigos de referência para edificar sua fé.",
  keywords: ["wiki cristã", "história do cristianismo", "glossário teológico", "teologia"],
  openGraph: {
    title: "WikiGelion | Euaggelion",
    description: "História do cristianismo, glossário teológico e artigos de referência.",
    url: "https://euaggelion.com.br/wiki/",
    type: 'website',
    siteName: "Euaggelion",
    locale: "pt_BR",
    images: [
      {
        url: "https://euaggelion.com.br/og-image.png",
        width: 1200,
        height: 630,
        alt: "WikiGelion - Euaggelion",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "WikiGelion | Euaggelion",
    description: "História do cristianismo, glossário teológico e artigos de referência.",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
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
        <>
          {/* Schema estruturado */}
          <CollectionPageSchema
            name="WikiGelion"
            description="História do cristianismo, glossário teológico e artigos de referência"
            url="https://euaggelion.com.br/wiki"
            itemCount={articles.length}
          />
          
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
        </>
    )
}