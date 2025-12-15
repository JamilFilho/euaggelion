import { ReactNode } from "react"

interface PageRootProps {
    children: ReactNode
}

export function PageRoot({children}: PageRootProps) {
    return(
        <section>
            {children}
        </section>
    )
}