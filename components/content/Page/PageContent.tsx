import { ReactNode } from "react";

interface PageContentProps {
    children: ReactNode
}

export function PageContent({children}: PageContentProps) {
    return (
        <section className="flex flex-col">
            {children}
        </section>
    )
}