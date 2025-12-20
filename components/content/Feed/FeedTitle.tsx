interface FeedTitleProps {
    content: string;
}

export default function FeedTitle({ content }: FeedTitleProps) {
    return (
        <header className="pt-12 px-10">
            <h3 className="text-3xl font-bold line-clamp-2 mb-4">{content}</h3>
        </header>
    );
}