interface BibleBooksTitleProps {
    content: string;
}

export default function BibleBooksTitle({content}:BibleBooksTitleProps)  {
    return <h3 className="text-xl font-bold">{content}</h3>
}