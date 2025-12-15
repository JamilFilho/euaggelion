import { ReactNode } from "react"

interface ArticleHeaderRootProps {
    children: ReactNode;
}

export function ArticleHeaderRoot({children}: ArticleHeaderRootProps) {
    return(
        <header className="mt-20 print:py-12 w-full h-fit flex flex-col justify-center mb-12 border-b print:border-none border-ring/20">
            {children}
        </header>
    )
}