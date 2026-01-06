interface ArticleDescriptionProps {
    content?: string
}

export function ArticleDescription({content}: ArticleDescriptionProps) {
    return(
        <h3 className="text-lg text-foreground/60">{content}</h3>
    )
}