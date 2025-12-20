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
    paginatedArticles: Article[];
    filter: string;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onFilterChange: (value: string) => void;
    onPageChange: (page: number) => void;
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
    itemsPerPage?: number;
    children: ReactNode;
}

export default function FeedProvider({ articles, itemsPerPage = 9, children }: FeedProviderProps) {
    const [filter, setFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Filtra os artigos
    const filteredArticles = articles.filter((article) => {
        if (filter === "all") return true;
        return article.testament === filter;
    });

    // Calcula a paginação
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    // Handler para mudança de filtro (reseta para página 1)
    const handleFilterChange = (value: string) => {
        setFilter(value);
        setCurrentPage(1);
    };

    // Handler para mudança de página
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <FeedContext.Provider
            value={{
                filteredArticles,
                paginatedArticles,
                filter,
                currentPage,
                totalPages,
                itemsPerPage,
                onFilterChange: handleFilterChange,
                onPageChange: handlePageChange,
            }}
        >
            {children}
        </FeedContext.Provider>
    );
}