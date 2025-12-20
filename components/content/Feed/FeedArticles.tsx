"use client";

import { Feed } from ".";
import { useFeedContext } from "./FeedProvider";

interface FeedArticlesProps {
    category: string;
}

export default function FeedArticles({ category }: FeedArticlesProps) {
    const { filteredArticles } = useFeedContext();
    
    return (
        <>
            {filteredArticles.map((article) => (
                <Feed.Item
                    key={article.slug}
                    slug={article.slug}
                    category={category}
                    isWiki={article.isWiki}
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