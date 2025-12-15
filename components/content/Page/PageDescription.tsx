interface PageDescriptionProps {
    content: string;
}

export function PageDescription({content}: PageDescriptionProps) {
    return(
        <h2 className="text-base text-foreground/60">{content}</h2>
    )
}