import { ReactNode } from "react"

interface NewsletterHeaderProps {
    children: ReactNode
}

export function NewsletterHeader({children}:NewsletterHeaderProps) {
    return(
        <header className="px-10 pb-20">
            {children}
        </header>
    )
}