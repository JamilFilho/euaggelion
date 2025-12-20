interface ArticleTitleProps {
    content: string;
    variant?: "default" | "wiki";
}

export function ArticleTitle({content, variant = "default"}: ArticleTitleProps) {
    const titleSize = variant === "wiki" ? "text-4xl" : "text-5xl";

    return(
        <h2 className={`${titleSize} md:w-2/3 text-primary font-bold`}>{content}</h2>
    )
}