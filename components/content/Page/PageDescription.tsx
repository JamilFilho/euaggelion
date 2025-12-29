interface PageDescriptionProps {
    content: string;
}

export function PageDescription({content}: PageDescriptionProps) {
    return(
        <h3 className="text-base md:text-xl text-foreground/60">{content}</h3>
    )
}