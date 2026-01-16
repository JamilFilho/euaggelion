import { ReactNode } from "react"

interface BibleGroupProps {
    children: ReactNode
}

export default function BibleGroup({children}:BibleGroupProps) {
    return(
        <div className="p-10 flex flex-col justify-center gap-4 print:border-none border-b border-ring/20">
            {children}
        </div>
    )
}