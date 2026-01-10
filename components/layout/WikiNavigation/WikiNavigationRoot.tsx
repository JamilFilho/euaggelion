import { ReactNode } from "react"

interface WikiNavigationProps {
    children:ReactNode
}

export default function WikiNavigationRoot({children}:WikiNavigationProps) {
    return <nav className="w-1/2 md:w-[85%] h-full gap-4 flex flex-row">{children}</nav>
}