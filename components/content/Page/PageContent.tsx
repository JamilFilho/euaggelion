import { ReactNode } from "react";

interface PageContentProps {
    children: ReactNode
}

export function PageContent({children}: PageContentProps) {
    return(
        <div>
            {children}
        </div>
    )
}