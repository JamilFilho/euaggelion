import { ReactNode } from "react";

interface AuthorRootProps {
    children: ReactNode
}

export default function AuthorRoot({children}:AuthorRootProps) {
    return(
        <section className="border-t border-ring/20 mt-20">
            <div className="pt-10 md:border-l md:border-r border-ring/20 md:w-3/5 md:mx-auto grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-0">
                {children}
            </div>
        </section>
    )
}