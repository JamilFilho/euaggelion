"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFeedContext } from "./FeedProvider";
import { ReactNode } from "react";

interface FeedHeaderProps {
    children?: ReactNode;
    show?: boolean;
    home?: boolean;
    testamentOptions?: { value: string; label: string }[];
    allowDateFilter?: boolean;
    allowAuthorFilter?: boolean;
}

export default function FeedHeader({
    children,
    show = true, 
    home = false,
    testamentOptions = [
        { value: "all", label: "Todos" },
        { value: "at", label: "Antigo Testamento" },
        { value: "nt", label: "Novo Testamento" }
    ],
    allowDateFilter = false,
    allowAuthorFilter = false,
}: FeedHeaderProps) {
    const { filter, filterType, authorFilter, onFilterChange, onFilterTypeChange, onAuthorFilterChange, authors } = useFeedContext();

    if (home) {
        return <header className="md:col-span-3 flex flex-col justify-center border-b border-ring/20 py-6 px-10">{children}</header>;
    }

    if (!show) {
        return null;
    }

    // Se apenas versículos (verso-a-verso)
    if (!allowDateFilter && !allowAuthorFilter) {
        return (
            <header className="md:col-span-3 flex items-center justify-between md:justify-end md:gap-4 border-b border-ring/20 py-4 px-10">
                <span className="text-foreground/60">Filtrar conteúdo:</span>
                <Select value={filter} onValueChange={onFilterChange}>
                    <SelectTrigger className="w-fit">
                        <SelectValue placeholder="Ver estudos do..." />
                    </SelectTrigger>
                    <SelectContent>
                        {testamentOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </header>
        );
    }

    // Se permite filtro por data e/ou autor
    return (
        <header className="md:col-span-3 flex flex-col md:flex-row flex-start md:items-center justify-between gap-4 border-b border-ring/20 py-4 px-10">
            <span className="text-foreground/60">Filtrar conteúdo:</span>
            
            <div className="flex flex-row gap-2">
            <Select value={filterType} onValueChange={(value) => onFilterTypeChange(value as "date" | "author")}>
                <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Selecionar filtro..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="date">Data de Publicação</SelectItem>
                    {allowAuthorFilter && <SelectItem value="author">Autor</SelectItem>}
                </SelectContent>
            </Select>

            {filterType === "date" && (
                <Select value={filter} onValueChange={onFilterChange}>
                    <SelectTrigger className="w-fit">
                        <SelectValue placeholder="Selecionar ordem..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Mais Recentes</SelectItem>
                        <SelectItem value="asc">Mais Antigos</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {filterType === "author" && allowAuthorFilter && (
                <Select value={authorFilter || ""} onValueChange={onAuthorFilterChange}>
                    <SelectTrigger className="w-fit">
                        <SelectValue placeholder="Selecionar autor..." />
                    </SelectTrigger>
                    <SelectContent>
                        {authors.map((author) => (
                            <SelectItem key={author} value={author}>
                                {author}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            </div>
        </header>
    );
}