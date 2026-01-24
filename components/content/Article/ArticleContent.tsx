"use client"

import { ReactNode } from "react"

interface ArticleContentProps {
    children: ReactNode;
}

export function ArticleContent({children}: ArticleContentProps) {
    return(
        <section className="md:w-2/3 md:mx-auto px-10 md:px-20 article-content overflow-visible">
            {children}
        </section>
    )
}