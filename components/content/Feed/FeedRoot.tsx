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
    children: ReactNode;
}

export default function FeedRoot({ articles, category, trailSlug, children }: FeedRootProps) {
    return (
        <FeedProvider articles={articles} category={category} trailSlug={trailSlug}>
            <div className="flex flex-col">
                <section className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ring/20 border-t border-ring/20">
                    {children}
                </section>
            </div>
        </FeedProvider>
    );
}