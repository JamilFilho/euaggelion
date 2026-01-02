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
            if (match.index > lastIndex) {
              parts.push(node.substring(lastIndex, match.index));
            }

            const fullMatch = match[0];
            const bookName = match[1].toLowerCase();
            const refDetails = match[2];
            const bookSlug = bookMap[bookName];

            if (bookSlug) {
              const reference: BibleReference = {
                book: match[1],
                bookSlug,
                chapters: [],
                fullMatch
              };
              
              parts.push(
                <span
                  key={`${match.index}-${fullMatch}`}
                  onClick={(e) => {
                    import("@/lib/bibleParser").then(({ parseReferenceDetails }) => {
                      reference.chapters = parseReferenceDetails(refDetails);
                      handleRefClick(e as any, reference);
                    });
                  }}
                  className="text-accent hover:underline decoration-dotted underline-offset-4 font-medium cursor-pointer"
                >
                  {fullMatch}
                </span>
              );
            } else {
              parts.push(fullMatch);
            }

            lastIndex = regex.lastIndex;
          }

          if (lastIndex < node.length) {
            parts.push(node.substring(lastIndex));
          }

          return parts.length > 0 ? <React.Fragment key={Math.random()}>{parts}</React.Fragment> : node;
        }

        if (React.isValidElement(node)) {
          const children = (node.props as any).children;
          if (children) {
            if (node.type === 'a' || node.type === 'button') return node;

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
