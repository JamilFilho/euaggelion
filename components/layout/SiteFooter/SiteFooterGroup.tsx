import { ReactNode } from "react"

interface SiteFooterGroupProps {
    children: ReactNode;
}

export default function SiteFooterGroup({children}:SiteFooterGroupProps) {
    return(
        <div className="w-full md:w-3/4">
            {children}
        </div>
    )
}