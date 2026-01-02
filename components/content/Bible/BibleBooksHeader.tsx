import { ReactNode } from "react"

interface BibleBooksHeaderProps {
    children: ReactNode
}

export default function BibleBooksHeader({children}:BibleBooksHeaderProps) {
    return(
        <header className="border-b border-t border-foreground/20 px-10 py-6">
            {children}
        </header>
    )
}