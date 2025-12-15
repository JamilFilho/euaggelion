import { ReactNode } from "react"

interface ArticleHeaderMetaProps {
    children: ReactNode
}

export function ArticleHeaderMeta({children}: ArticleHeaderMetaProps) {
    return(
        <div className="print:hidden md:mt-auto *:py-6 grid grid-cols-3 *:flex *:justify-center divide-x divide-ring/20 text-foreground/60">
            {children}        
        </div>
    )
}