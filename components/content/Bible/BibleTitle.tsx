interface BibleTitleProps {
    content: string;
}

export default function BibleTitle({content}:BibleTitleProps) {
    return(
        <h2 className="md:w-2/3 text-4xl text-primary font-bold">{content}</h2>
    )
}