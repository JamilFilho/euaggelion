import { ReactNode } from "react"

interface SiteFooterRootProps {
    children: ReactNode
}

export function SiteFooterRoot({children}: SiteFooterRootProps) {
    return(
        <footer className="site-footer print:hidden grid grid-cols-2 gap-6 border-t border-ring/10 py-14">
            {children}
        </footer>
    )
}