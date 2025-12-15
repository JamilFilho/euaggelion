import { ReactNode } from "react"

interface ArticleHeaderProps {
    children: ReactNode
}

export function ArticleRoot({children}: ArticleHeaderProps) {
    return(
        <article>
            {children}
        </article>
    )
}