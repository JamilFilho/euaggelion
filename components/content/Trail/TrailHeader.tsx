import { ReactNode } from "react"

interface TrailHeaderProps {
    children: ReactNode
}

export default function TrailHeader({children}:TrailHeaderProps) {
    return(
        <header className="w-full px-10 py-20 flex flex-col justify-center border-b print:border-none border-ring/20">
            {children}
        </header>
    )
}