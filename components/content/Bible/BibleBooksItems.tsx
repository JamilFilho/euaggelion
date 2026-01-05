import Link from "next/link";
import { BibleVersion } from "@/lib/getBible";

interface BibleBooksItemsProps {
    version: BibleVersion;
    testament?: "at" | "nt";
    currentVersionId?: string;
}

export default function BibleBooksItems({ version, testament = "at", currentVersionId }: BibleBooksItemsProps) {
    const books = testament === "at" ? version.books.slice(0, 39) : version.books.slice(39);
    
    return <div className="grid grid-cols-2 md:grid-cols-5">
        {books.map((book, index) => {
            const isLastBook = index === books.length - 1;
            const remainder = books.length % 5;
            const mobileRemainder = books.length % 2;
            
            const colSpan = isLastBook && remainder === 1 
            ? "md:col-span-5" 
            : isLastBook && remainder === 2 
            ? "md:col-span-4" 
            : isLastBook && remainder === 3 
            ? "md:col-span-3" 
            : isLastBook && remainder === 4 
            ? "md:col-span-2" 
            : "";

            const mobileColSpan = isLastBook && mobileRemainder === 1 
            ? "col-span-2" 
            : "";

            // Use currentVersionId if provided, otherwise fallback to version.id
            const versionPath = currentVersionId || version.id;

            return (
            <Link
                key={book.slug}
                href={`/biblia/${versionPath}/${book.slug}`}
                className={`p-4 text-center flex items-center justify-center border-b border-r border-l border-ring/20 hover:bg-black/20 transition-colors ease-in-out ${colSpan} ${mobileColSpan}`}
            >
                <span className="text-foreground/80 text-lg font-medium">{book.name}</span>
            </Link>
            );
        })}
    </div>
}