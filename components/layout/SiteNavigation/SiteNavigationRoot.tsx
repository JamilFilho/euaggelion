import { ReactNode } from "react"

interface SiteNavigationRootProps {
    children:ReactNode
}

export default function SiteNavigationRoot({children}:SiteNavigationRootProps) {
    return <nav className="w-1/2 md:w-[85%] h-full gap-4 flex flex-row">{children}</nav>
}