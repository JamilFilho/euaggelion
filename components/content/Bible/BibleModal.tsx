"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import { clientLogger } from "@/lib/logger";
import { useBibleVersion } from "@/lib/context/BibleVersionContext";

interface BibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference: {
    book: string;
    bookSlug: string;
    chapters: {
      chapter: number;
      verses: number[];
      ranges: [number, number][];
    }[];
    fullMatch: string;
  } | null;
}

export default function BibleModal({ isOpen, onClose, reference }: BibleModalProps) {
  let contextVersion;
  try {
    const context = useBibleVersion();
    contextVersion = context.currentVersion;
  } catch (e) {
    contextVersion = "nvt";
  }
  const currentVersion = contextVersion || "nvt";
  const [content, setContent] = useState<{ chapter: number; verses: { num: number; text: string }[] }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && reference && currentVersion) {
      fetchContent();
    }
  }, [isOpen, reference, currentVersion]);

  const fetchContent = async () => {
    if (!reference || !currentVersion) return;
    setLoading(true);
    
    try {
      const results = await Promise.all(
        reference.chapters.map(async (c) => {
          const response = await fetch(`/api/bible?version=${currentVersion}&book=${reference.bookSlug}&chapter=${c.chapter}`);
          const data = await response.json();
          
          if (data.verses) {
            const filteredVerses = data.verses.map((text: string, index: number) => ({
              num: index + 1,
              text
            })).filter((v: { num: number }) => {
              // Se não houver versículos ou intervalos específicos, mostra o capítulo todo
              const inVerses = c.verses.includes(v.num);
              const inRanges = c.ranges.some(([start, end]) => {
                // 999 significa "até o fim do capítulo"
                const effectiveEnd = end === 999 ? Infinity : end;
                return v.num >= start && v.num <= effectiveEnd;
              });
              
              // Se o parser não encontrou versículos específicos (ex: "João 3"), mostra tudo
              if (c.verses.length === 0 && c.ranges.length === 0) return true;
              
              return inVerses || inRanges;
            });
            
            return { chapter: c.chapter, verses: filteredVerses };
          }
          return { chapter: c.chapter, verses: [] };
        })
      );
      
      setContent(results);
    } catch (error) {
      clientLogger.error("❌ Erro ao carregar texto bíblico:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-background text-foreground">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl font-bold text-accent">
            {reference?.fullMatch}
          </DrawerTitle>
          <p className="text-sm text-muted-foreground uppercase tracking-widest">
            {currentVersion?.toUpperCase()}
          </p>
        </DrawerHeader>

        <div className="mt-6 space-y-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-accent" />
            </div>
          ) : (
            content.map((c, idx) => (
              <div key={idx} className="space-y-2">
                {content.length > 1 && (
                  <h3 className="border-b border-ring/10 pb-1 text-lg font-semibold">
                    Capítulo {c.chapter}
                  </h3>
                )}
                <div className="space-y-4">
                  {c.verses.map((v) => (
                    <p key={v.num} className="leading-relaxed">
                      <sup className="mr-2 font-bold text-accent">{v.num}</sup>
                      {v.text}
                    </p>
                  ))}
                </div>
              </div>
            ))
          )}
          {!loading && content.every((c) => c.verses.length === 0) && (
            <p className="py-10 text-center text-muted-foreground">
              Texto não encontrado para esta versão.
            </p>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
