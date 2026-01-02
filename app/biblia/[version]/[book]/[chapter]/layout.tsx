import { getBibleBook } from "@/lib/getBible";
import Link from "next/link";

interface Props {
  params: Promise<{
    version: string;
    book: string;
    chapter: string;
  }>;
}

export default async function BibleLayout({ children, params }: { children: React.ReactNode; params: Props["params"]; }) {
    const { version: versionId, book: bookSlug, chapter: chapterStr } = await params;
    const book = getBibleBook(versionId, bookSlug);
    const chapterNum = parseInt(chapterStr);
    
    return(
        <>
        <div className="print:hidden px-10 flex flex-row justify-between items-center gap-2 border-b border-ring/20">
            <Link href={`/biblia/${versionId}/${bookSlug}`} title={book ? book.name : "Bíblia Sagrada"} className="text-lg font-bold">
                <h3 className="py-4">{book ? `${book.name} ${chapterNum}` : "Bíblia Sagrada"}</h3>
            </Link>
        </div>

        {children}
        </>
    )
}