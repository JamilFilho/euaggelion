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
    author?: string;
    date?: string;
}

type FilterType = "testament" | "date" | "author";

interface FeedContextType {
    filteredArticles: Article[];
    paginatedArticles: Article[];
    filter: string;
    filterType: FilterType;
    authorFilter?: string;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    authors: string[];
    onFilterChange: (value: string) => void;
    onFilterTypeChange: (type: FilterType) => void;
    onAuthorFilterChange: (author: string) => void;
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
    category?: string;
    children: ReactNode;
}

export default function FeedProvider({ articles, itemsPerPage = 12, category, children }: FeedProviderProps) {
    // Definir estado inicial baseado na categoria
    const isVersoAVerso = category === "verso-a-verso";
    const [filterType, setFilterType] = useState<FilterType>(isVersoAVerso ? "testament" : "date");
    const [filter, setFilter] = useState<string>(isVersoAVerso ? "all" : "desc");
    const [authorFilter, setAuthorFilter] = useState<string>();
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Extrair lista única de autores
    const authors = Array.from(new Set(
        articles
            .filter(a => a.author)
            .map(a => a.author!)
    )).sort();

    // Filtra e ordena os artigos baseado no tipo de filtro
    const filteredArticles = articles.filter((article) => {
        // Se está filtrando por testament (verso-a-verso)
        if (filterType === "testament") {
            if (filter === "all") return true;
            return article.testament === filter;
        }
        
        // Se está filtrando por autor
        if (filterType === "author") {
            if (!authorFilter) return true;
            return article.author === authorFilter;
        }
        
        // Padrão: filtro por testament
        if (article.testament !== undefined) {
            if (filter === "all") return true;
            return article.testament === filter;
        }
        
        return true;
    }).sort((a, b) => {
        // Ordenação por data
        if (filterType === "date" || filterType === "author") {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            
            // filter === "desc" = mais recentes primeiro
            // filter === "asc" = mais antigos primeiro
            return filter === "asc" ? dateA - dateB : dateB - dateA;
        }
        
        return 0;
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

    // Handler para mudança de tipo de filtro
    const handleFilterTypeChange = (type: FilterType) => {
        setFilterType(type);
        setFilter(type === "date" ? "desc" : "all");
        setAuthorFilter(undefined);
        setCurrentPage(1);
    };

    // Handler para mudança de filtro de autor
    const handleAuthorFilterChange = (author: string) => {
        setAuthorFilter(author);
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
                filterType,
                authorFilter,
                currentPage,
                totalPages,
                itemsPerPage,
                authors,
                onFilterChange: handleFilterChange,
                onFilterTypeChange: handleFilterTypeChange,
                onAuthorFilterChange: handleAuthorFilterChange,
                onPageChange: handlePageChange,
            }}
        >
            {children}
        </FeedContext.Provider>
    );
}