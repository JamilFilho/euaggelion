import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ArticleFooterProps {
    children: ReactNode;
    className?: string;
}

export function ArticleFooter({children, className}: ArticleFooterProps) {
    return(
        <footer className={cn("print:hidden border-t border-b border-ring/20", className)}>
            {children}
        </footer>
    )
}