import { getRelativeTime } from "@/lib/relativeDate";

interface ArticlePublishedAtProps {
    content: string;
}

export function ArticlePublishedAt({content}: ArticlePublishedAtProps) {
    return(
        <span className="col-span-1">{getRelativeTime(content)}</span>
    )
}