"use client";

import { Feed } from ".";
import { useFeedContext } from "./FeedProvider";

interface FeedArticlesProps {
    category: string;
    isCategoryPage?: boolean;
}

export default function FeedArticles({ category, isCategoryPage = false }: FeedArticlesProps) {
    const { paginatedArticles, trailSlug } = useFeedContext();
    
    return (
        <>
            {paginatedArticles.map((article, index) => (
                <Feed.Item
                    key={article.slug}
                    slug={article.slug}
                    category={category}
                    isWiki={article.isWiki}
                    index={index}
                    totalItems={paginatedArticles.length}
                >
                    <Feed.Title content={article.title} />
                    <Feed.Excerpt content={article.description} />
                    <Feed.Link
                        slug={article.slug}
                        category={category}
                        articleCategory={article.category}
                        trailSlug={trailSlug}
                        isWiki={article.isWiki}
                        isCategoryPage={isCategoryPage}
                    />
                </Feed.Item>
            ))}
        </>
    );
}