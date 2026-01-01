import { Page } from "@/components/content/Page";
import { getBibleBook, getBibleVersion } from "@/lib/getBible";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Article } from "@/components/content/Article";
import { ArrowRight } from "lucide-react";

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
    <Article.Root>
      <Article.Header>
        <Article.Group>
          <Article.Title content={book.name} />
        </Article.Group>

        <Article.Meta>
          <span className="col-span-1">Autoria</span>
          <span>{book.author}</span>
        </Article.Meta>

        <div className="flex flex-col md:flex-row gap-4 py-8 px-10 w-full border-t border-foreground/20">
          <span className="text-lg font-semibold text-foreground/80">Tema central</span>
          <span className="text-lg text-foreground/60">{book.description}</span>
          
        </div>
      </Article.Header>
      <Link className="w-full -mt-12 flex flex-row justify-between items-center px-10 py-4 border-b border-ring/20 bg-black/20 hover:bg-black/30 disabled:bg-black/10 disabled:cursor-not-allowed text-foreground transition-all ease-in-out hover:pr-8 font-semibold" href={`/wiki/biblia/${bookSlug}`}>
        Estudar livro
        <ArrowRight className="size-4"/>
      </Link>
      
      <Page.Content>
        <div className="grid grid-cols-5 md:grid-cols-10 divide-x divide-y divide-foreground/20">
          {book.chapters.map((_, index) => {
            const chapterNum = index + 1;
            const isLastChapter = index === book.chapters.length - 1;
            const remainder = book.chapters.length % 10;
            const mobileRemainder = book.chapters.length % 5;
            
            const colSpan = isLastChapter && remainder === 1 
              ? "md:col-span-10" 
              : isLastChapter && remainder === 2 
              ? "md:col-span-9" 
              : isLastChapter && remainder === 3 
              ? "md:col-span-8" 
              : isLastChapter && remainder === 4 
              ? "md:col-span-7" 
              : isLastChapter && remainder === 5 
              ? "md:col-span-6" 
              : isLastChapter && remainder === 6 
              ? "md:col-span-5" 
              : isLastChapter && remainder === 7 
              ? "md:col-span-4" 
              : isLastChapter && remainder === 8 
              ? "md:col-span-3" 
              : isLastChapter && remainder === 9 
              ? "md:col-span-2" 
              : "";

            const mobileColSpan = isLastChapter && mobileRemainder === 1 
              ? "col-span-5" 
              : isLastChapter && mobileRemainder === 2 
              ? "col-span-4" 
              : isLastChapter && mobileRemainder === 3 
              ? "col-span-3" 
              : isLastChapter && mobileRemainder === 4 
              ? "col-span-2" 
              : "";

            return (
              <Link 
                key={chapterNum} 
                href={`/biblia/${versionId}/${bookSlug}/${chapterNum}`} 
                className={`p-4 text-center flex items-center justify-center hover:bg-black/20 transition-colors ease-in-out ${colSpan} ${mobileColSpan}`}
              >
                <span className="text-lg font-medium">{chapterNum}</span>
              </Link>
            );
          })}
        </div>
      </Page.Content>
    </Article.Root>
  );
}