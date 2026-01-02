import { ReactNode } from "react"

interface BibleHeaderProps {
    children: ReactNode
}

export default function BibleHeader({children}: BibleHeaderProps) {
    return(
        <header className="print:py-12 w-full h-fit flex flex-col justify-center print:border-none border-ring/20">
            {children}
        </header>
    )
}