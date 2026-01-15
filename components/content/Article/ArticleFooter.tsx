import { ReactNode } from "react"

interface ArticleFooterProps {
    children: ReactNode
}

export function ArticleFooter({children}: ArticleFooterProps) {
    return(
        <footer className="print:hidden border-t border-b border-ring/20">
            {children}
        </footer>
    )
}