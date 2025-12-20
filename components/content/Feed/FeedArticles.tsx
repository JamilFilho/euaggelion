"use client";

import { Feed } from ".";
import { useFeedContext } from "./FeedProvider";

interface FeedArticlesProps {
    category: string;
}

export default function FeedArticles({ category }: FeedArticlesProps) {
    const { paginatedArticles } = useFeedContext();
    
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
                        isWiki={article.isWiki}
                    />
                </Feed.Item>
            ))}
        </>
    );
}