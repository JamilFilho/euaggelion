import { ReactNode } from "react"

interface BibleContentProps {
    children: ReactNode
}

export default function BibleContent({children}:BibleContentProps) {
    return(
        <section className="md:w-2/3 md:mx-auto px-10 md:px-20 mt-12 article-content">
            {children}
        </section>
    )
}