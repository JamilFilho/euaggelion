import { getBibleChapter, getBibleBook, getBibleVersion } from "@/lib/getBible";
import { notFound } from "next/navigation";
import React, { JSX } from 'react';
import VerseHighlighter from '@/components/content/Bible/VerseHighlighter';
import { Bible } from "@/components/content/Bible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import VerseActions from "@/components/content/Bible/VerseActions";
import { MoreHorizontal } from "lucide-react";

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

  return (
    <Bible.Root>
      <VerseHighlighter />
      <Bible.Content>
          {verses.map((verse, index) => (
            <Popover>
              <PopoverTrigger asChild>
              <div key={index} className="relative group">
                <p id={`verse-${index + 1}`} className="hover:bg-black/20 transition-colors">
                  <span className="inline-block p-4">
                    <sup className="relative text-sm font-bold text-accent mt-1 mr-2">
                      {index + 1}
                    </sup>
                    <span className="text-lg">{verse}</span>
                  </span>
                </p>
              </div>
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
          ))}
      </Bible.Content>
    </Bible.Root>
  );
}
