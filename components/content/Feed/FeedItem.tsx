import { ReactNode } from "react";

interface FeedItemProps {
    children: ReactNode;
    slug: string;
    category: string;
    isWiki?: boolean;
}

export default function FeedItem({ children, slug, category, isWiki }: FeedItemProps) {
    return <article className="h-full">{children}</article>;
}