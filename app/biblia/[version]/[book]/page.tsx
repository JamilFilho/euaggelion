import { Page } from "@/components/content/Page";
import { getBibleBook, getBibleVersion } from "@/lib/getBible";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

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
        <Page.Title content={book.name} />
        <Page.Description content={`Selecione um capítulo para ler (${book.chapters.length} capítulos disponíveis)`} />
      </Page.Header>
      
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
    </Page.Root>
  );
}