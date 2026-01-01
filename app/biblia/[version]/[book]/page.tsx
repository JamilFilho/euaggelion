import { Page } from "@/components/content/Page";
import { getBibleBook, getBibleVersion } from "@/lib/getBible";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Article } from "@/components/content/Article";

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
          <Article.Description content={"test"}/>
        </Article.Group>
      </Article.Header>
      
      <Page.Content>
        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
          {book.chapters.map((_, index) => {
            const chapterNum = index + 1;
            return (
              <Link 
                key={chapterNum} 
                href={`/biblia/${versionId}/${bookSlug}/${chapterNum}`} 
                className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent transition-colors text-center aspect-square flex items-center justify-center"
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