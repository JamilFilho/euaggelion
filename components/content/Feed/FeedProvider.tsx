"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Article {
    slug: string;
    title: string;
    description: string;
    category: string;
    testament?: "at" | "nt";
    isWiki?: boolean;
    count?: number;
}

interface FeedContextType {
    filteredArticles: Article[];
    filter: string;
    onFilterChange: (value: string) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function useFeedContext() {
    const context = useContext(FeedContext);
    if (!context) {
        throw new Error("useFeedContext must be used within FeedProvider");
    }
    return context;
}

interface FeedProviderProps {
    articles: Article[];
    children: ReactNode;
}

export default function FeedProvider({ articles, children }: FeedProviderProps) {
    const [filter, setFilter] = useState<string>("all");

    const filteredArticles = articles.filter((article) => {
        if (filter === "all") return true;
        return article.testament === filter;
    });

    return (
        <FeedContext.Provider
            value={{
                filteredArticles,
                filter,
                onFilterChange: setFilter,
            }}
        >
            {children}
        </FeedContext.Provider>
    );
}