"use client";

import { ReactNode } from "react";
import { useFeedContext } from "./FeedProvider";

interface FeedGroupProps {
    children: ReactNode;
}

export default function FeedGroup({ children }: FeedGroupProps) {
    const { filteredArticles } = useFeedContext();
    
    return (
        <>
            {filteredArticles.length === 0 ? (
                <div className="md:col-span-3 p-10 text-center text-foreground/60">
                    Nenhum conteúdo encontrado.
                </div>
            ) : (
                children
            )}
        </>
    );
}