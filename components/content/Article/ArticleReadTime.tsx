interface ArticleReadTimeProps {
    content: string;
}

export function ArticleReadTime({content}: ArticleReadTimeProps) {
    return(
        <span className="col-span-2">{content}</span>
    )
}