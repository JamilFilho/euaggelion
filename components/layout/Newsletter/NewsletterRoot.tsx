import { ReactNode } from "react"

interface NewsletterRootProps {
    children: ReactNode
}

export function NewsletterRoot({children}:NewsletterRootProps) {
    return(
        <section className="print:hidden w-full py-20 border-t border-b border-ring/20 bg-background/20">
            {children}
        </section>
    )
}