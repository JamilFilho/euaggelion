interface TrailTitleProps {
    content: string;
}

export function TrailTitle({content}: TrailTitleProps) {
    return(
        <h2 className="mb-4 text-5xl text-primary font-bold">{content}</h2>
    )
}