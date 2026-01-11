import { ReactNode } from "react";
import FeedProvider from "./FeedProvider";

interface Article {
    slug: string;
    title: string;
    description: string;
    category: string;
    testament?: "at" | "nt";
    isWiki?: boolean;
    count?: number;
    author?: string;
    date?: string;
}

interface FeedRootProps {
    articles: Article[];
    category: string;
    trailSlug?: string;
    itemsPerPage?: number;
    children: ReactNode;
}

export default function FeedRoot({ articles, category, trailSlug, itemsPerPage, children }: FeedRootProps) {
    return (
        <FeedProvider articles={articles} category={category} trailSlug={trailSlug} itemsPerPage={itemsPerPage}>
            <div className="flex flex-col">
                {children}
            </div>
        </FeedProvider>
    );
}