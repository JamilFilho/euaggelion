import { ReactNode } from "react"

interface PageHeaderProps {
    children: ReactNode;
    variant?: "default" | "home" | "wiki";
}

export function PageHeader({children, variant = "default"}: PageHeaderProps) {
    const bgColor = variant === "home" ? "bg-black/10" : "";
    const sizeHeight = variant === "wiki" ? "h-56 md:h-96" : "h-96";

    return(
        <header className={`${bgColor} ${sizeHeight} px-10 flex flex-col justify-center gap-4`}>
            {children}
        </header>
    )
}