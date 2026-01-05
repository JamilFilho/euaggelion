import { ReactNode } from "react"

interface ArticleHeaderMetaProps {
    children: ReactNode
}

export function ArticleHeaderMeta({children}: ArticleHeaderMetaProps) {
    return(
        <div className="print:hidden md:mt-auto *:py-6 grid grid-cols-4 *:flex *:justify-center text-foreground/60">
            {children}        
        </div>
    )
}