import { getBibleChapter, getBibleBook, getBibleVersion } from "@/lib/getBible";
import { notFound } from "next/navigation";
import { Article } from "@/components/content/Article";

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

  // Create navigation objects for Article.Navigation
  const navigation = {
    prev: hasPrev ? {
      slug: `biblia/${versionId}/${bookSlug}/${chapterNum - 1}`,
      title: `Capítulo ${chapterNum - 1}`,
      description: `Capítulo anterior: ${chapterNum - 1}`
    } : null,
    next: hasNext ? {
      slug: `biblia/${versionId}/${bookSlug}/${chapterNum + 1}`,
      title: `Capítulo ${chapterNum + 1}`,
      description: `Próximo capítulo: ${chapterNum + 1}`
    } : null
  };

  return (
    <Article.Root>
      <Article.Header>
        <Article.Group>
        <Article.Title content={`${book.name} ${chapterNum}`} />
        </Article.Group>
      </Article.Header>
      
      <Article.Content>
          {verses.map((verse, index) => (
            <p id={`verse-${index + 1}`} key={index} className="flex gap-4">
              <span className="text-sm font-bold text-muted-foreground mt-1 min-w-[1.5rem]">
                {index + 1}
              </span>
              <span>{verse}</span>
            </p>
          ))}
      </Article.Content>

      <Article.Footer>
        <Article.Navigation
          prev={navigation.prev}
          next={navigation.next}
          category={book.name}
        />
      </Article.Footer>
    </Article.Root>
  );
}
