import { getRelativeTime } from "@/lib/relativeDate";

interface ArticlePublishedAtProps {
    content: string;
}

export function ArticlePublishedAt({content}: ArticlePublishedAtProps) {
    return(
        <span className="col-span-1 font-semibold black:font-normal">{getRelativeTime(content)}</span>
    )
}