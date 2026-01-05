import { getRelativeTime } from "@/lib/relativeDate";

interface ArticlePublishedAtProps {
    content: string;
}

export function ArticlePublishedAt({content}: ArticlePublishedAtProps) {
    return(
        <span className="col-span-2 md:col-span-1 border-r border-ring/20 font-semibold black:font-normal">{getRelativeTime(content)}</span>
    )
}