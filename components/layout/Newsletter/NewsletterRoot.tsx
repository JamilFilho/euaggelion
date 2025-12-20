import { ReactNode } from "react"

interface NewsletterRootProps {
    children: ReactNode
}

export function NewsletterRoot({children}:NewsletterRootProps) {
    return(
        <section className="print:hidden w-full pt-20 pb-10 border-t border-b border-ring/20 bg-black/10">
            {children}
        </section>
    )
}