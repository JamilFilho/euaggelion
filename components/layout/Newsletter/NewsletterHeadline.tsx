interface NewsletterHeadlineProps {
    content: string;
}

export function NewsletterHeadline({content}:NewsletterHeadlineProps) {
    return(
        <p className="text-lg text-foreground/60">{content}</p>
    )
}