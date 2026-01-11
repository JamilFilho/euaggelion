'use client';

import { Copy, Share2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface VerseActionsProps {
  verse: string;
  bookName: string;
  chapter: number;
  verseNumber: number;
  version: string;
}

export default function VerseActions({
  verse,
  bookName,
  chapter,
  verseNumber,
  version,
}: VerseActionsProps) {
  const [copying, setCopying] = useState(false);
  const [sharing, setSharing] = useState(false);

  const verseReference = `${bookName} ${chapter}:${verseNumber} — ${version}`;
  const fullText = `"${verse}" (${verseReference})`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(fullText);
      toast.success('Versículo copiado para a área de transferência');
    } catch (error) {
      toast.error('Erro ao copiar versículo');
    } finally {
      setCopying(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${verseReference}`,
          text: verse,
          url: shareUrl,
        });
      } else {
        // Fallback para navegadores que não suportam Web Share API
        await navigator.clipboard.writeText(fullText);
        toast.success('Versículo copiado para a área de transferência');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast.error('Erro ao compartilhar versículo');
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopy}
        disabled={copying}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-ring/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        title="Copiar versículo"
      >
        <Copy className="w-4 h-4" />
        <span>Copiar</span>
      </button>

      <button
        onClick={handleShare}
        disabled={sharing}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-ring/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        title="Compartilhar versículo"
      >
        <Share2 className="w-4 h-4" />
        <span>Compartilhar</span>
      </button>
    </div>
  );
}
