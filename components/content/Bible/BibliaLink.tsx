"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { findBibleReferences, BibleReference, getBookMap, getBibleRegex } from "@/lib/bibleParser";
import BibleModal from "./BibleModal";

interface BibliaLinkProps {
  children: ReactNode;
}

export default function BibliaLink({ children }: BibliaLinkProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRef, setSelectedRef] = useState<BibleReference | null>(null);
  const [processedContent, setProcessedContent] = useState<ReactNode>(children);

  const handleRefClick = (e: React.MouseEvent, ref: BibleReference) => {
    e.preventDefault();
    setSelectedRef(ref);
    setIsModalOpen(true);
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
          let match;

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
              
              parts.push(
                <span
                  key={`${match.index}-${reference.fullMatch}`}
                  onClick={(e) => {
                    import("@/lib/bibleParser").then(({ parseReferenceDetails }) => {
                      reference.chapters = parseReferenceDetails(cleanedRefDetails);
                      handleRefClick(e as any, reference);
                    });
                  }}
                  className="text-accent hover:underline decoration-dotted underline-offset-4 font-medium cursor-pointer"
                >
                  {reference.fullMatch}
                </span>
              );

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
            // Ignorar links, botões e blockquotes
            if (node.type === 'a' || node.type === 'button' || node.type === 'blockquote') return node;

            return React.cloneElement(node, {
              ...node.props,
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reference={selectedRef}
      />
    </>
  );
}
