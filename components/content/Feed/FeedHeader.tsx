"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFeedContext } from "./FeedProvider";
import { ReactNode, useRef, useState, useEffect } from "react";
import { getCategoryNames, getAuthorNames } from "@/app/actions";

interface FeedHeaderProps {
    children?: ReactNode;
    show?: boolean;
    home?: boolean;
    testamentOptions?: { value: string; label: string }[];
    allowDateFilter?: boolean;
    allowAuthorFilter?: boolean;
    allowCategoryFilter?: boolean;
}

export default function FeedHeader({ children, show = true,  home = false, testamentOptions = [{ value: "all", label: "Todos" }, { value: "at", label: "Antigo Testamento" }, { value: "nt", label: "Novo Testamento" }], allowDateFilter = false, allowAuthorFilter = false, allowCategoryFilter = false }: FeedHeaderProps) {
    const { filter, filterType, authorFilter, onFilterChange, onFilterTypeChange, onAuthorFilterChange, authors, categories } = useFeedContext();

    const [categoryNames, setCategoryNames] = useState<Record<string, string>>({});
    const [authorNames, setAuthorNames] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchNames = async () => {
            if (categories.length > 0) {
                const catNames = await getCategoryNames(categories);
                setCategoryNames(catNames);
            }
            if (authors.length > 0) {
                const authNames = await getAuthorNames(authors);
                setAuthorNames(authNames);
            }
        };
        fetchNames();
    }, [categories, authors]);

    if (home) {
        return <header className="md:col-span-3 flex flex-col justify-center border-t border-ring/20 py-6 px-10">{children}</header>;
    }

    if (!show) {
        return null;
    }

    // Se apenas versículos (verso-a-verso)
    if (!allowDateFilter && !allowAuthorFilter) {
        return (
            <>
                <section  className="md:col-span-3 flex items-center justify-end md:justify-end md:gap-4 border-t border-b border-ring/20 py-4 px-10 bg-secondary">
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
                </section>
            </>
        );
    }

    // Se permite filtro por data e/ou autor
    return (
        <>
            <section className="md:col-span-3 flex flex-col md:flex-row flex-start md:items-center justify-end gap-4 border-t border-b border-ring/20 py-4 px-6 md:px-10 bg-secondary">
                <span className="text-foreground/60">Filtrar conteúdo:</span>
                
                <div className="flex flex-row gap-2">
                <Select value={filterType} onValueChange={(value) => onFilterTypeChange(value as "date" | "author" | "category")}>
                    <SelectTrigger className="w-fit">
                        <SelectValue placeholder="Selecionar filtro..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="date">Data de Publicação</SelectItem>
                        {allowAuthorFilter && <SelectItem value="author">Autor</SelectItem>}
                        {allowCategoryFilter && <SelectItem value="category">Categoria</SelectItem>}
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
                                    {authorNames[author] || author}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {filterType === "category" && allowCategoryFilter && (
                    <Select value={filter} onValueChange={onFilterChange}>
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Selecionar categoria..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {categoryNames[category] || category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                </div>
            </section>
        </>
    );
}