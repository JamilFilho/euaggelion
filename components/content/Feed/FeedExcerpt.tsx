interface FeedExcerptProps {
    content: string;
}

export default function FeedExcerpt({ content }: FeedExcerptProps) {
    return (
        <section className="flex-1 px-10 mb-10">
            <p className="text-foreground/60 line-clamp-3">{content}</p>
        </section>
    );
}