import { Bible } from "@/components/content/Bible";
import Breadcrumb from "@/components/ui/breadcrumb";
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
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Bíblia", href: "/biblia" },
            { label: book ? book.name : "Bíblia Sagrada", href: `/biblia/${versionId}/${bookSlug}` },
            { label: `${book?.name === "Salmos" ? "Salmo" : "Capítulo"} ${chapterNum}`, href: `/biblia/${versionId}/${bookSlug}/${chapterNum}` },
          ]}
        />
        <div className="sticky top-14 bg-secondary print:hidden px-10 flex flex-row justify-between items-center gap-2 border-b border-ring/20 z-[800]">
            <Link href={`/biblia/${versionId}/${bookSlug}`} title={book ? book.name : "Bíblia Sagrada"} className="text-lg font-bold">
              <h3 className="py-4">{book ? `${book.name} ${chapterNum}` : "Bíblia Sagrada"}</h3>
            </Link>
        </div>

        {children}

        {book && (
          <aside className="mt-10 print:hidden border-t border-ring/20 bg-secondary/80">
            <header className="py-6 px-10 border-b border-ring/20">
              <span className="text-base font-bold">{book.name}</span>
            </header>

            <Bible.BookChapters bookChapters={book} versionId={versionId} bookSlug={bookSlug} />
          </aside>
        )}
        </>
    )
}