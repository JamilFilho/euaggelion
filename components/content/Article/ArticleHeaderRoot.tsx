import { ReactNode } from "react"

interface ArticleHeaderRootProps {
    children: ReactNode;
    variant?: "default" | "wiki";
}

export function ArticleHeaderRoot({children, variant = "default"}: ArticleHeaderRootProps) {
    const marginClass = variant === "wiki" ? "" : "mt-20 md:mt-0";

    return(
        <header className={`${marginClass} print:py-12 w-full h-fit flex flex-col justify-center mb-12 border-b print:border-none border-ring/20`}>
            {children}
        </header>
    )
}