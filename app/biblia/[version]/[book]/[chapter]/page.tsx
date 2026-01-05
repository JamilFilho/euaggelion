import { getBibleChapter, getBibleBook, getBibleVersion } from "@/lib/getBible";
import { notFound } from "next/navigation";
import { Article } from "@/components/content/Article";
import VerseHighlighter from '@/components/content/Bible/VerseHighlighter';
import { Bible } from "@/components/content/Bible";

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

  const navigation = {
    prev: hasPrev ? {
      slug: `biblia/${versionId}/${bookSlug}/${chapterNum - 1}`,
      title: `${book?.name === "Salmos" ? "Salmo" : "Capítulo"} ${chapterNum - 1}`,
      description: `Capítulo anterior: ${chapterNum - 1}`
    } : null,
    next: hasNext ? {
      slug: `biblia/${versionId}/${bookSlug}/${chapterNum + 1}`,
      title: `${book?.name === "Salmos" ? "Salmo" : "Capítulo"} ${chapterNum + 1}`,
      description: `Próximo capítulo: ${chapterNum + 1}`
    } : null
  };

  return (
    <Bible.Root>
      <VerseHighlighter />
      <Bible.Content>
          {verses.map((verse, index) => (
            <p id={`verse-${index + 1}`} key={index} className="p-4 hover:bg-black/20 transition-colors">
              <sup className="text-sm font-bold text-accent mt-1 mr-2">
                {index + 1}
              </sup>
              <span className="text-lg">{verse}</span>
            </p>
          ))}
      </Bible.Content>

      <Article.Footer>
        <Article.Actions
          excerpt=""
          link=""
          headline={`Bíblia Sagrada - ${book.name} ${chapterNum}`}
        />
      </Article.Footer>
      
      <Article.Navigation
        prev={navigation.prev}
        next={navigation.next}
        category={book.name}
      />
    </Bible.Root>
  );
}
