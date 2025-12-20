import { ReactNode } from "react";

interface SiteHeaderRootProps {
    children: ReactNode
}

export function SiteHeaderRoot({ children }: SiteHeaderRootProps) {
    return(
        <header className="print:hidden w-full fixed md:relative top-0 left-0 py-6 px-10 flex items-center h-20 border-b border-ring/20 bg-background text-secondary-foreground z-[900]">
            { children }
        </header>
    )
}