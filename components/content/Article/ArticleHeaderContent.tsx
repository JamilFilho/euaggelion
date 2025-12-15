import { ReactNode } from "react"

interface ArticleHeaderContentProps {
    children: ReactNode;
}

export function ArticleHeaderContent({children}: ArticleHeaderContentProps) {
    return(
        <div className="md:h-96 px-10 py-12 flex flex-col justify-center gap-4 print:border-none border-b border-ring/20">
            {children}
        </div>
    )
}