interface TrailDescriptionProps {
    content?: string
}

export function TrailDescription({content}: TrailDescriptionProps) {
    return(
        <h3 className="text-lg text-foreground/60">{content}</h3>
    )
}