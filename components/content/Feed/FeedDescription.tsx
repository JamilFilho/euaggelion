interface FeedDescriptionProps {
    content?: string;
}

export default function FeedDescription({content}:FeedDescriptionProps) {
    return <p className="text-lg text-foreground/60">{content}</p>;
}