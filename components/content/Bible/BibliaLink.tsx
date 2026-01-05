"use client";

import React, { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { findBibleReferences, BibleReference, getBookMap, getBibleRegex, parseReferenceDetails } from "@/lib/bibleParser";
import BibleModal from "./BibleModal";
import { Copy, ExternalLink } from "lucide-react";

interface BibliaLinkProps {
  children: ReactNode;
  variant?: "modal" | "link";
}

import { useBibleVersion } from '@/lib/context/BibleVersionContext';

export default function BibliaLink({ children, variant = "modal" }: BibliaLinkProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRef, setSelectedRef] = useState<BibleReference | null>(null);
  const [processedContent, setProcessedContent] = useState<ReactNode>(children);
  const { currentVersion } = useBibleVersion();

  const handleRefClick = (e: React.MouseEvent, ref: BibleReference) => {
    e.preventDefault();
    setSelectedRef(ref);
    if (variant !== "link") {
      setIsDrawerOpen(true);
    }
  };

  useEffect(() => {
    const processContent = async () => {
      const bookMap = await getBookMap();
      const bookNames = Object.keys(bookMap);
      const regex = getBibleRegex(bookNames);

      const walkAndReplace = (node: ReactNode): ReactNode => {
        if (typeof node === "string") {
          const parts: ReactNode[] = [];
          let lastIndex = 0;
          let match: RegExpExecArray | null;

          regex.lastIndex = 0;

          while ((match = regex.exec(node)) !== null) {
            let fullMatch = match[0];
            let bookNameMatch = match[1];
            let refDetails = match[2];
            
            // Limpeza de pontuação no final da referência (detalhes)
            // Remove parênteses, pontos, vírgulas, espaços e travessões extras no final
            const cleanedRefDetails = refDetails.replace(/[\s\.\,\;\:\)\-\—]+$/, '');
            const trailingPunctuation = refDetails.substring(cleanedRefDetails.length);
            
            const bookName = bookNameMatch.toLowerCase();
            const bookSlug = bookMap[bookName];

            if (bookSlug) {
              // Texto antes do match
              if (match.index > lastIndex) {
                parts.push(node.substring(lastIndex, match.index));
              }

              const reference: BibleReference = {
                book: bookNameMatch,
                bookSlug,
                chapters: [],
                fullMatch: `${bookNameMatch} ${cleanedRefDetails}`
              };
              // Parse the details now (synchronously) to support link generation
              const parsedRef = parseReferenceDetails(cleanedRefDetails);
              reference.chapters = parsedRef.chapters;
              reference.isWholeChapterRange = parsedRef.isWholeChapterRange;

              // Detectar se é uma referência cross-chapter (ex: "20.11-22.5")
              // Cross-chapter tem múltiplos capítulos sequenciais onde o primeiro tem range com fim=999
              const isCrossChapter = reference.chapters && reference.chapters.length > 1 && 
                reference.chapters[0].ranges && 
                reference.chapters[0].ranges.length > 0 &&
                reference.chapters[0].ranges.some(([_, end]) => end === 999) &&
                !reference.isWholeChapterRange;

              // Detectar se é intervalo de capítulos inteiros (ex: "1-2")
              const isWholeChapterRange = reference.isWholeChapterRange;

              // CASO 1: Intervalo de capítulos inteiros (ex: "Gn 1-2")
              if (isWholeChapterRange) {
                // Renderizar capítulos inteiros mantendo a notação original (ex: "Gn 1-2")
                const firstChapter = reference.chapters[0];
                const lastChapter = reference.chapters[reference.chapters.length - 1];
                
                const wholeChapterText = `${bookNameMatch} ${firstChapter.chapter}-${lastChapter.chapter}`;
                
                if (variant === "link") {
                  const version = currentVersion || "nvt";
                  const href = `/biblia/${version}/${bookSlug}/${firstChapter.chapter}`;

                  parts.push(
                    <Link
                      key={match!.index}
                      href={href}
                      className="underline decoration-dotted inline-flex items-center text-accent font-medium"
                      title={wholeChapterText}
                    >
                      {wholeChapterText}
                      <ExternalLink className="h-4 w-4 mx-1" />
                    </Link>
                  );
                } else {
                  parts.push(
                    <span
                      key={match!.index}
                      onClick={(e) => {
                        handleRefClick(e as any, {
                          ...reference,
                          fullMatch: wholeChapterText
                        });
                      }}
                      className="inline-flex items-center text-accent underline decoration-dotted underline-offset-4 font-medium cursor-pointer"
                    >
                      {wholeChapterText}
                      <Copy className="h-4 w-4 mx-1" />
                    </span>
                  );
                }
              }
              // CASO 2: Cross-chapter reference (ex: "Ap 20.11-22.5")
              else if (isCrossChapter) {
                // Renderizar como uma única referência com notação completa
                const firstChapter = reference.chapters[0];
                const lastChapter = reference.chapters[reference.chapters.length - 1];
                
                // Construir texto da referência cross-chapter
                const startVerse = firstChapter.ranges[0]?.[0] || 1;
                const endVerse = lastChapter.ranges[lastChapter.ranges.length - 1]?.[1] === 999 
                  ? lastChapter.ranges[lastChapter.ranges.length - 1]?.[0] 
                  : lastChapter.ranges[lastChapter.ranges.length - 1]?.[1] || 1;
                
                const crossChapterText = `${bookNameMatch} ${firstChapter.chapter}.${startVerse}-${lastChapter.chapter}.${endVerse}`;
                
                if (variant === "link") {
                  const version = currentVersion || "nvt";
                  const href = `/biblia/${version}/${bookSlug}/${firstChapter.chapter}#verse-${startVerse}`;

                  parts.push(
                    <Link
                      key={match!.index}
                      href={href}
                      className="underline decoration-dotted inline-flex items-center text-accent font-medium"
                      title={crossChapterText}
                    >
                      {crossChapterText}
                      <ExternalLink className="h-4 w-4 mx-1" />
                    </Link>
                  );
                } else {
                  // Modal com todos os capítulos intermediários
                  parts.push(
                    <span
                      key={match!.index}
                      onClick={(e) => {
                        handleRefClick(e as any, {
                          ...reference,
                          fullMatch: crossChapterText
                        });
                      }}
                      className="inline-flex items-center text-accent underline decoration-dotted underline-offset-4 font-medium cursor-pointer"
                    >
                      {crossChapterText}
                      <Copy className="h-4 w-4 mx-1" />
                    </span>
                  );
                }
              }
              // CASO 3: Múltiplos capítulos do mesmo livro separados (ex: "Mc 12:26; 7:10")
              else if (reference.chapters && reference.chapters.length > 1) {
                reference.chapters.forEach((chapterData, chapterIndex) => {
                  const chapterNum = chapterData.chapter;
                  let verseNum = 1;
                  if (chapterData.verses && chapterData.verses.length > 0) {
                    verseNum = chapterData.verses[0];
                  } else if (chapterData.ranges && chapterData.ranges.length > 0) {
                    verseNum = chapterData.ranges[0][0];
                  }

                  // Construir texto da referência para este capítulo
                  // Para exibição no texto: primeira referência inclui o nome do livro, demais apenas capítulo
                  let chapterRefText = chapterIndex === 0 
                    ? `${bookNameMatch} ${chapterNum}`
                    : `${chapterNum}`;
                  
                  const verseParts: string[] = [];
                  
                  // Verificar se é um capítulo inteiro (range [1, 999])
                  const isWholeChapter = chapterData.ranges && chapterData.ranges.length === 1 &&
                    chapterData.ranges[0][0] === 1 && chapterData.ranges[0][1] === 999 &&
                    (!chapterData.verses || chapterData.verses.length === 0);
                  
                  // Só adicionar versículos se NÃO for um capítulo inteiro
                  if (!isWholeChapter) {
                    if (chapterData.verses && chapterData.verses.length > 0) {
                      verseParts.push(chapterData.verses.join(", "));
                    }
                    if (chapterData.ranges && chapterData.ranges.length > 0) {
                      verseParts.push(chapterData.ranges.map(([s, e]) => `${s}–${e}`).join(", "));
                    }
                  }
                  
                  if (verseParts.length > 0) {
                    chapterRefText += `:${verseParts.join(", ")}`;
                  }

                  // Para o fullMatch (usado no modal/link), sempre incluir o nome do livro
                  let fullMatchText = `${bookNameMatch} ${chapterNum}`;
                  if (verseParts.length > 0) {
                    fullMatchText += `:${verseParts.join(", ")}`;
                  }

                  const singleChapterRef: BibleReference = {
                    book: bookNameMatch,
                    bookSlug,
                    chapters: [chapterData],
                    fullMatch: fullMatchText
                  };

                  if (variant === "link") {
                    const version = currentVersion || "nvt";
                    const shouldHighlight = !isWholeChapter && (
                      (chapterData.verses && chapterData.verses.length > 0) ||
                      (chapterData.ranges && chapterData.ranges.length > 0)
                    );

                    const highlights: string[] = [];
                    
                    if (shouldHighlight && chapterData.verses && chapterData.verses.length > 0) {
                      chapterData.verses.forEach(v => highlights.push(`verse-${v}`));
                    }
                    if (shouldHighlight && chapterData.ranges && chapterData.ranges.length > 0) {
                      chapterData.ranges.forEach(([s, e]) => {
                        for (let i = s; i <= e; i++) highlights.push(`verse-${i}`);
                      });
                    }

                    const uniqueHighlights = Array.from(new Set(highlights));
                    const highlightParam = shouldHighlight ? uniqueHighlights.join(",") : "";
                    const hasHighlights = highlightParam && highlightParam.length > 0;
                    const href = hasHighlights
                      ? `/biblia/${version}/${bookSlug}/${chapterNum}?highlight=${encodeURIComponent(highlightParam)}#verse-${verseNum}`
                      : `/biblia/${version}/${bookSlug}/${chapterNum}`;

                    parts.push(
                      <Link
                        key={`${match!.index}-${chapterIndex}`}
                        href={href}
                        className="underline decoration-dotted inline-flex items-center text-accent font-medium"
                        title={`${bookNameMatch} ${chapterNum}:${verseParts.join(", ")}`}
                      >
                        {chapterRefText}
                        <ExternalLink className="h-4 w-4 mx-1" />
                      </Link>
                    );

                    if (chapterIndex < reference.chapters.length - 1) {
                      parts.push("; ");
                    }
                  } else {
                    parts.push(
                      <span
                        key={`${match!.index}-${chapterIndex}`}
                        onClick={(e) => {
                          handleRefClick(e as any, singleChapterRef);
                        }}
                        className="inline-flex items-center text-accent underline decoration-dotted underline-offset-4 font-medium cursor-pointer"
                      >
                        {chapterRefText}
                        <Copy className="h-4 w-4 mx-1" />
                      </span>
                    );

                    if (chapterIndex < reference.chapters.length - 1) {
                      parts.push("; ");
                    }
                  }
                });
              }
              // CASO 4: Capítulo único (comportamento original)
              else {
                if (variant === "link") {
                  // Determine chapter and verse to link to (first verse or range start)
                  let chapterNum = 1;
                  let verseNum = 1;
                  if (reference.chapters && reference.chapters.length > 0) {
                    const c = reference.chapters[0];
                    chapterNum = c.chapter;
                    if (c.verses && c.verses.length > 0) {
                      verseNum = c.verses[0];
                    } else if (c.ranges && c.ranges.length > 0) {
                      verseNum = c.ranges[0][0];
                    }
                  }

                  const version = currentVersion || "nvt";

                  // Build highlight param for the full interval in this chapter
                  const highlights: string[] = [];
                  const c = reference.chapters && reference.chapters.length > 0 ? reference.chapters[0] : null;

                  const isWholeChapter = !!c && c.ranges && c.ranges.length === 1 &&
                    c.ranges[0][0] === 1 && c.ranges[0][1] === 999 &&
                    (!c.verses || c.verses.length === 0);

                  const shouldHighlight = !reference.isWholeChapterRange && !isWholeChapter && !!c && (
                    (c.verses && c.verses.length > 0) ||
                    (c.ranges && c.ranges.length > 0)
                  );

                  if (shouldHighlight && c) {
                    if (c.verses && c.verses.length > 0) {
                      c.verses.forEach(v => highlights.push(`verse-${v}`));
                    }
                    if (c.ranges && c.ranges.length > 0) {
                      c.ranges.forEach(([s, e]) => {
                        for (let i = s; i <= e; i++) highlights.push(`verse-${i}`);
                      });
                    }
                  }

                  const uniqueHighlights = Array.from(new Set(highlights));
                  const highlightParam = shouldHighlight ? uniqueHighlights.join(",") : "";

                  // If there are no verse highlights, link to the chapter page without anchor or highlight
                  const hasHighlights = highlightParam && highlightParam.length > 0;
                  const href = hasHighlights
                    ? `/biblia/${version}/${bookSlug}/${chapterNum}?highlight=${encodeURIComponent(highlightParam)}#verse-${verseNum}`
                    : `/biblia/${version}/${bookSlug}/${chapterNum}`;

                  parts.push(
                    <Link
                      key={`${match.index}-${reference.fullMatch}`}
                      href={href}
                      className="underline decoration-dotted inline-flex items-center text-accent font-medium"
                      title={reference.fullMatch}
                    >
                      {reference.fullMatch}
                      <ExternalLink className="h-4 w-4 mx-1" />
                    </Link>
                  );
                } else {
                  parts.push(
                    <span
                      key={`${match.index}-${reference.fullMatch}`}
                      onClick={(e) => {
                        handleRefClick(e as any, reference);
                      }}
                      className="inline-flex items-center text-accent underline decoration-dotted underline-offset-4 font-medium cursor-pointer"
                    >
                      {reference.fullMatch}
                      <Copy className="h-4 w-4 ml-1" />
                    </span>
                  );
                }
              }

              // Adiciona a pontuação de volta como texto normal
              if (trailingPunctuation) {
                parts.push(trailingPunctuation);
              }
              
              lastIndex = match.index + match[0].length;
            } else {
              // Se não for um livro válido, ignora e continua
              if (match.index > lastIndex) {
                parts.push(node.substring(lastIndex, match.index + match[0].length));
              } else {
                parts.push(match[0]);
              }
              lastIndex = match.index + match[0].length;
            }
          }

          if (lastIndex < node.length) {
            parts.push(node.substring(lastIndex));
          }

          return parts.length > 0 ? <React.Fragment key={Math.random()}>{parts}</React.Fragment> : node;
        }

        if (React.isValidElement(node)) {
          const children = (node.props as any).children;
          if (children) {
            // Ignorar links, botões, blockquotes e títulos h1-h6
            const type = node.type;
            const isHeading = typeof type === 'string' && /^h[1-6]$/.test(type);
            if (type === 'a' || type === 'button' || type === 'blockquote' || isHeading) return node;

            return React.cloneElement(node, {
              ...(node.props as object),
              children: React.Children.map(children, walkAndReplace),
            } as any);
          }
        }

        if (Array.isArray(node)) {
          return node.map(walkAndReplace);
        }

        return node;
      };

      setProcessedContent(React.Children.map(children, walkAndReplace));
    };

    processContent();
  }, [children]);

  return (
    <>
      {processedContent}
      <BibleModal
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        reference={selectedRef}
      />
    </>
  );
}
