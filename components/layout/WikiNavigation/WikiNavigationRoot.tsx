import { ReactNode } from "react"
import WikiNavigationDrawer from "./WikiNavigationDrawer"

interface WikiNavigationProps {
    children:ReactNode
}

export default function WikiNavigationRoot({children}:WikiNavigationProps) {
    return (
        <div className="w-full flex flex-row items-center">
            {children}
        </div>
    )
}