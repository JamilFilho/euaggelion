interface NewsletterTitleProps {
    content: string
}

export function NewsletterTitle({content}: NewsletterTitleProps) {
    return(
        <h3 className="text-5xl font-bold break-words">{content}</h3>
    )
}