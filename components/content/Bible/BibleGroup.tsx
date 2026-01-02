import { ReactNode } from "react"

interface BibleGroupProps {
    children: ReactNode
}

export default function BibleGroup({children}:BibleGroupProps) {
    return(
        <div className="md:h-96 px-10 py-12 flex flex-col justify-center gap-4 print:border-none border-b border-ring/20">
            {children}
        </div>
    )
}