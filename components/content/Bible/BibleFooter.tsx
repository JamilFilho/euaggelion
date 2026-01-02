import { ReactNode } from "react"

interface BibleFooterProps {
    children: ReactNode
}

export default function BibleFooter({children}: BibleFooterProps) {
    return(
        <footer className="print:hidden border-t border-b border-ring/20 px-10 py-6">
            {children}
        </footer>
    )
}