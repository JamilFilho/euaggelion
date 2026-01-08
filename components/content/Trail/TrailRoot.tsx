import { ReactNode } from "react";

interface TrailRootProps {
    children: ReactNode;
}

export default function TrailRoot({children}:TrailRootProps) {
    return(
        <article>
            {children}
        </article>
    )
}