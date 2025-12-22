"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFeedContext } from "./FeedProvider";
import { ReactNode } from "react";

interface FeedHeaderProps {
    children?: ReactNode;
    show?: boolean;
    home?: boolean;
    options?: { value: string; label: string }[];
}

export default function FeedHeader({
    children,
    show = true, 
    home = false,
    options = [
        { value: "all", label: "Todos" },
        { value: "at", label: "Antigo Testamento" },
        { value: "nt", label: "Novo Testamento" }
    ] 
}: FeedHeaderProps) {
    const { filter, onFilterChange } = useFeedContext();

    if (home) {
        return <header className="md:col-span-3 flex flex-col justify-center border-b border-ring/20 py-6 px-10">{children}</header>;
    }

    if (!show) {
        return null;
    }

    return (
        <header className="md:col-span-3 flex items-center justify-between md:justify-end md:gap-4 border-b border-ring/20 py-4 px-10">
            <span className="text-foreground/60">Filtrar conteúdo:</span>
            <Select value={filter} onValueChange={onFilterChange}>
                <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Ver estudos do..." />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </header>
    );
}