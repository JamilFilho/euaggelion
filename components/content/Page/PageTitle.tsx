interface PageTitleProps {
    content: string;
}

export function PageTitle({content}: PageTitleProps) {
    return(
        <h1 className="text-4xl md:text-5xl font-bold">{content}</h1>
    )
}