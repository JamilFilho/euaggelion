interface ArticleReadTimeProps {
    content: string;
}

export function ArticleReadTime({content}: ArticleReadTimeProps) {
    return(
        <span className="col-span-2 md:col-span-3 font-semibold black:font-normal">{content}</span>
    )
}