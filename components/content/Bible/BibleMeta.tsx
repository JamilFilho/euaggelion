import { ReactNode } from "react"

interface BibleMetaProps {
    children: ReactNode
}

export default function BibleMeta({children}:BibleMetaProps) {
    return(
        <div className="w-full print:hidden md:mt-auto grid grid-cols-3 text-foreground/60">
            {children}        
        </div>
    )
}