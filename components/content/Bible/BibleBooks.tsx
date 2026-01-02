import { ReactNode } from "react";

interface BibleBooksProps {
    children: ReactNode;
}

export default function BibleBooks({children}:BibleBooksProps) {
    return(
        <section className="flex flex-col">
            {children}
        </section>
    )
}