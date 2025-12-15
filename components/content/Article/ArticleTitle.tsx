interface ArticleTitleProps {
    content: string
}

export function ArticleTitle({content}: ArticleTitleProps) {
    return(
        <h2 className="md:w-2/3 text-primary text-5xl font-bold">{content}</h2>
    )
}