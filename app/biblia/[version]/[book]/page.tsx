import { Page } from "@/components/content/Page";
import { getBibleBook, getBibleVersion } from "@/lib/getBible";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Article } from "@/components/content/Article";
import { ArrowRight } from "lucide-react";
import { Bible } from "@/components/content/Bible";

interface Props {
  params: Promise<{
    version: string;
    book: string;
  }>;
}

export default async function BibleBookPage({ params }: Props) {
  const { version: versionId, book: bookSlug } = await params;
  
  const version = getBibleVersion(versionId);
  const book = getBibleBook(versionId, bookSlug);

  if (!version || !book) {
    notFound();
  }

  return (
    <Bible.Root>
      <Bible.Header>
        <Bible.Group>
          <Bible.Title content={book.name} />
        </Bible.Group>

        <Bible.Meta>
          <div className="col-span-3 *:p-6 grid grid-cols-3">
            <span className="col-span-1 border-r border-ring/20">Autoria</span>
            <span className="col-span-2 border-ring/20">{book.author}</span>
            <span className="col-span-1 border-r border-t border-ring/20">Data</span>
            <span className="col-span-2 border-t border-ring/20">{book.date}</span>
          </div>
        </Bible.Meta>

        <div className="flex flex-col md:flex-row gap-4 py-8 px-10 w-full border-t border-foreground/20">
          <span className="text-lg font-semibold text-foreground/80">Tema central</span>
          <span className="text-lg text-foreground/60">{book.description}</span>
          
        </div>
      </Bible.Header>

      <Link className="w-full flex flex-row justify-between items-center px-10 py-4 border-b border-ring/20 bg-black/20 hover:bg-black/30 disabled:bg-black/10 disabled:cursor-not-allowed text-foreground transition-all ease-in-out hover:pr-8 font-semibold" href={`/wiki/biblia/${bookSlug}`}>
        Estudar livro
        <ArrowRight className="size-4"/>
      </Link>
      
      <Bible.Feed>
        <Bible.Books>
            <Bible.BooksHeader>
              <Bible.BooksTitle content="Capítulos" />
            </Bible.BooksHeader>

            <Bible.BookChapters bookChapters={book} versionId={versionId} bookSlug={bookSlug} />
          </Bible.Books>
      </Bible.Feed>
    </Bible.Root>
  );
}