import { getBibleChapter, getBibleBook, getBibleVersion, getConcordancesForVerse } from "@/lib/getBible";
import { notFound } from "next/navigation";
import VerseHighlighter from '@/components/content/Bible/VerseHighlighter';
import { Bible } from "@/components/content/Bible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import VerseActions from "@/components/content/Bible/VerseActions";
import { ConcordanceEntry } from "@/lib/getBible";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";

interface Props {
  params: Promise<{
    version: string;
    book: string;
    chapter: string;
  }>;
}

function processVerseText(verse: string, concordances: ConcordanceEntry[]): JSX.Element[] {
  if (concordances.length === 0) {
    return [<span key="text">{verse}</span>];
  }

  const parts: JSX.Element[] = [];
  let remainingText = verse;
  let offset = 0;

  concordances.forEach((concordance, idx) => {
    const word = concordance.palavra.toLowerCase();
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    const match = remainingText.match(regex);

    if (match) {
      const matchIndex = match.index!;
      const beforeText = remainingText.slice(0, matchIndex + match[0].length);
      const afterText = remainingText.slice(matchIndex + match[0].length);

      parts.push(<span key={`text-${offset}`}>{beforeText}</span>);
      
      parts.push(
        <Popover key={`concordance-${idx}`}>
          <PopoverTrigger asChild>
            <button className="inline-block mx-0.5 px-1 py-0.5 text-xs text-accent" style={{ verticalAlign: 'super', fontSize: '0.6em' }}>
              {String.fromCharCode(97 + idx)} {/* a, b, c, etc. */}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-semibold">{concordance.palavra}</h4>
              {concordance["fonte"] && (
                <p className="text-muted-foreground">Fonte: {concordance.fonte}</p>
              )}
              <p>Ocorrências: {concordance.ocorrencias}</p>
              {concordance["veja tambem"] && concordance["veja tambem"].length > 0 && (
                <div className="my-4">
                  <p className="font-medium">Veja também:</p>
                  <p className="mt-2 text-muted-foreground">
                    {concordance["veja tambem"].map((relatedWord, idx) => {
                      const letter = relatedWord.charAt(0).toLowerCase();
                      const entrySlug = slugify(relatedWord);
                      return (
                        <span key={relatedWord}>
                          <Link 
                            href={`/biblia/concordancia/${letter}/${entrySlug}`}
                            className="text-accent underline decoration-dotted underline-offset-4"
                          >
                            {relatedWord}
                          </Link>
                          {idx < (concordance["veja tambem"]?.length ?? 0) - 1 && ", "}
                        </span>
                      );
                    })}
                  </p>
                </div>
              )}
              {concordance.concordancias && concordance.concordancias.length > 0 && (
                <div>
                  <p className="text-sm font-medium">Referências:</p>
                    <div className="space-y-2 mb-4">
                      {concordance.concordancias.slice(0, 4).map((ref, refIdx) => (
                        <div key={refIdx} className="mt-2 text-xs text-muted-foreground border-l-2 border-accent/20 pl-2">
                          <p className="font-medium">{ref.referencia}</p>
                          <p className="italic">{ref.texto}</p>
                        </div>
                      ))}
                    </div>
                    {concordance.concordancias.length > 4 && (
                      <Button asChild size="sm">
                        <Link href={`/biblia/concordancia/${concordance.slug}`}>
                          Ver todas as {concordance.concordancias.length} passagens
                        </Link>
                      </Button>
                    )}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      );

      remainingText = afterText;
      offset += beforeText.length;
    }
  });

  if (remainingText) {
    parts.push(<span key={`text-${offset}`}>{remainingText}</span>);
  }

  return parts;
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
    <Bible.Root>
      <VerseHighlighter />
      <Bible.Content>
          {verses.map((verse, index) => {
            const verseConcordances = getConcordancesForVerse(versionId, bookSlug, chapterNum, index + 1);
            const processedVerse = processVerseText(verse, verseConcordances);
            return (
              <div key={index} className="relative group">
                <p id={`verse-${index + 1}`} className="hover:bg-black/20 transition-colors">
                  <span className="inline-block p-4">
                    <sup className="relative text-sm font-bold text-accent mt-1 mr-2">
                      {index + 1}
                    </sup>
                    <span className="text-lg">{processedVerse}</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="ml-2 p-1 rounded hover:bg-black/10 transition-colors opacity-0 group-hover:opacity-100" title="Ações do versículo">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto">
                        <VerseActions
                          verse={verse}
                          bookName={book.name}
                          chapter={chapterNum}
                          verseNumber={index + 1}
                          version={version.name}
                        />
                      </PopoverContent>
                    </Popover>
                  </span>
                </p>
              </div>
            );
          })}
      </Bible.Content>
    </Bible.Root>
  );
}
