"use client";

import { ReactNode } from "react";
import { useFeedContext } from "./FeedProvider";

interface FeedGroupProps {
    children: ReactNode;
}

export default function FeedGroup({ children }: FeedGroupProps) {
    const { paginatedArticles } = useFeedContext();
    
    return (
        <>
            {paginatedArticles.length === 0 ? (
                <div className="md:col-span-3 p-10 text-center text-foreground/60">
                    Nenhum conteúdo encontrado.
                </div>
            ) : (
                <section className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ring/20 border-t border-ring/20">
                {children}
                </section>
            )}
        </>
    );
}