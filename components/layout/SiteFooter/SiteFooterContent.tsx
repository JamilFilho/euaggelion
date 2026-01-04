import { ReactNode } from "react"

interface SiteFooterContent {
    children: ReactNode;
}

export default function SiteFooterContent({children}:SiteFooterContent) {
    return(
        <section className="px-10 col-span-2 text-base mt-8 pt-8 border-t border-ring/20 flex flex-col-reverse md:flex-row gap-4">
            {children}
        </section>
    )
}