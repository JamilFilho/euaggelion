import Link from "next/link";
import { ElementType } from "react";

interface SiteHeaderNavigationProps {
    icon: ElementType
}

export function SiteHeaderNavigation({icon: Icon}: SiteHeaderNavigationProps) {
    return(
        <>
        <Link className="md:hidden" href="/p/links">
            <Icon className="color-white size-5" />
        </Link>
        </>
    )
}