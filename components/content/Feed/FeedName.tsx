interface FeedNameProps {
    content: string;
}

export default function FeedName({content}:FeedNameProps) {
    return <h2 className="mb-2 text-3xl font-bold">{content}</h2>;
}