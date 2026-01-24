import { ReactNode } from "react"

interface PageHeaderProps {
    children: ReactNode;
    variant?: "default" | "home" | "wiki" | "center";
}

export function PageHeader({children, variant = "default"}: PageHeaderProps) {
    const bgColor = variant === "home" ? "items-center text-center bg-black/10" : "";
    const center = variant === "center" ? "items-center text-center md:text-left md:items-start" : "";

    return(
        <header className={`${bgColor} ${center} px-10 py-20 flex flex-col justify-center gap-4`}>
            {children}
        </header>
    )
}