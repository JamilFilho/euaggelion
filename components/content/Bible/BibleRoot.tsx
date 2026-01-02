import { ReactNode } from "react"

interface BibleRootProps {
    children: ReactNode
}

export default function BibleRoot({children}: BibleRootProps) {
    return(
        <section>
            {children}
        </section>
    )
}