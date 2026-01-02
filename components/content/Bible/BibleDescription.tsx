interface BibleDescriptionProps {
    content?: string;
}

export default function BibleDescription({content}:BibleDescriptionProps) {
    return(
        <h3 className="md:w-2/3 text-lg text-foreground/60">{content}</h3>
    )
}