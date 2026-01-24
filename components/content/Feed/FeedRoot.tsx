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
    emptyMessage?: string;
    children: ReactNode;
}

export default function FeedRoot({ articles, category, trailSlug, itemsPerPage, emptyMessage, children }: FeedRootProps) {
    return (
        <FeedProvider articles={articles} category={category} trailSlug={trailSlug} itemsPerPage={itemsPerPage} emptyMessage={emptyMessage}>
            <div className="flex flex-col border-b border-ring/20">
                {children}
            </div>
        </FeedProvider>
    );
}