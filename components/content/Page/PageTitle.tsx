interface PageTitleProps {
    content: string;
}

export function PageTitle({content}: PageTitleProps) {
    return(
        <h2 className="text-4xl md:text-5xl font-bold">{content}</h2>
    )
}