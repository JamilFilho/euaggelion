import Link from "next/link";

interface BibleBookChaptersProps {
    bookChapters: {
        chapters: string[][];
    };
    versionId: string;
    bookSlug: string;
}

export default function BibleBookChapters({ bookChapters, versionId, bookSlug }: BibleBookChaptersProps) {
    const book = bookChapters;
    return <div className="grid grid-cols-5 md:grid-cols-10 divide-x divide-y divide-foreground/20">
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
}