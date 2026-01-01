import { Page } from "@/components/content/Page";
import { getBibleChapter, getBibleBook, getBibleVersion } from "@/lib/getBible";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  params: Promise<{
    version: string;
    book: string;
    chapter: string;
  }>;
}

export default async function BibleChapterPage({ params }: Props) {
  const { version: versionId, book: bookSlug, chapter: chapterStr } = await params;
  const chapterNum = parseInt(chapterStr);
  
  const version = getBibleVersion(versionId);
  const book = getBibleBook(versionId, bookSlug);
  const verses = getBibleChapter(versionId, bookSlug, chapterNum);

  if (!version || !book || !verses) {
    notFound();
  }

  const hasPrev = chapterNum > 1;
  const hasNext = chapterNum < book.chapters.length;

  return (
    <Page.Root>
      <Page.Header>
        <div className="flex items-center justify-between w-full mb-4">
          <Link href={`/biblia/${versionId}`}>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para livros
            </Button>
          </Link>
          <span className="text-sm font-medium text-muted-foreground">
            {version.name}
          </span>
        </div>
        <Page.Title text={`${book.name} ${chapterNum}`} />
      </Page.Header>
      
      <Page.Content>
        <div className="max-w-2xl mx-auto space-y-6 text-lg leading-relaxed">
          {verses.map((verse, index) => (
            <p key={index} className="flex gap-4">
              <span className="text-sm font-bold text-muted-foreground mt-1 min-w-[1.5rem]">
                {index + 1}
              </span>
              <span>{verse}</span>
            </p>
          ))}
        </div>

        <div className="flex justify-between items-center mt-12 pt-6 border-t">
          {hasPrev ? (
            <Link href={`/biblia/${versionId}/${bookSlug}/${chapterNum - 1}`}>
              <Button variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Capítulo {chapterNum - 1}
              </Button>
            </Link>
          ) : (
            <div />
          )}

          {hasNext ? (
            <Link href={`/biblia/${versionId}/${bookSlug}/${chapterNum + 1}`}>
              <Button variant="outline">
                Capítulo {chapterNum + 1}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </Page.Content>
    </Page.Root>
  );
}
