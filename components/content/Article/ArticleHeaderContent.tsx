import { ReactNode } from "react"

interface ArticleHeaderContentProps {
    children: ReactNode;
}

export function ArticleHeaderContent({children}: ArticleHeaderContentProps) {
    return(
        <div className="w-full md:w-2/3 md:mx-auto md:h-[32rem] px-10 py-12 flex flex-col justify-center gap-4">
            {children}
        </div>
    )
}