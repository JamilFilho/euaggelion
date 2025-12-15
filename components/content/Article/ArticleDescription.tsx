interface ArticleDescriptionProps {
    content?: string
}

export function ArticleDescription({content}: ArticleDescriptionProps) {
    return(
        <h3 className="md:w-2/3 text-lg text-foreground/60">{content}</h3>
    )
}