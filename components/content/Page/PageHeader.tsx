import { ReactNode } from "react"

interface PageHeaderProps {
    children: ReactNode
}

export function PageHeader({children}: PageHeaderProps) {
    return(
        <header className="h-96 flex flex-col justify-center gap-4 px-10 pt-20">
            {children}
        </header>
    )
}