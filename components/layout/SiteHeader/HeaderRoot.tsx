import { ReactNode } from "react";

interface SiteHeaderRootProps {
    children: ReactNode
}

export function SiteHeaderRoot({ children }: SiteHeaderRootProps) {
    return(
        <header className="print:hidden w-full fixed md:relative top-0 left-0 px-10 flex flex-row justify-between items-center gap-4 h-20 border-b border-ring/20 bg-secondary text-secondary-foreground z-[900]">
            { children }
        </header>
    )
}