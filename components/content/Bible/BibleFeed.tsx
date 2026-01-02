import { ReactNode } from "react"

interface BibleFeedProps {
    children: ReactNode
}

export default function BibleFeed({children}:BibleFeedProps) {
    return(
        <div>
            {children}
        </div>
    )
}