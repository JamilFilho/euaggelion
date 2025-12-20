import { ReactNode } from "react";

interface FeedItemProps {
    children: ReactNode;
    slug: string;
    category: string;
    isWiki?: boolean;
    index: number;
    totalItems: number;
}

export default function FeedItem({ children, index, totalItems }: FeedItemProps) {
    const isLastItem = index === totalItems - 1;
    const remainder = totalItems % 3;
    
    const colSpan = isLastItem && remainder === 1 
        ? "md:col-span-3" 
        : isLastItem && remainder === 2 
        ? "md:col-span-2" 
        : "";
    
    return (
        <article className={`h-full flex flex-col ${colSpan}`}>
            {children}
        </article>
    );
}