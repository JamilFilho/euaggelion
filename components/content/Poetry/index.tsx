import { ReactNode } from 'react';

interface PoetryProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface VerseProps {
  children: ReactNode;
  className?: string;
}

interface StanzaProps {
  children: ReactNode;
  className?: string;
}

// Componente principal para poesia
function PoetryRoot({ children, align = 'center', className = '' }: PoetryProps) {
  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align];

  return (
    <div className={`poetry-container my-8 ${alignmentClass} ${className}`}>
      {children}
    </div>
  );
}

// Componente para estrofe/estanza
function Stanza({ children, className = '' }: StanzaProps) {
  return (
    <div className={`poetry-stanza mb-10 last:mb-0 ${className}`}>
      {children}
    </div>
  );
}

// Componente para verso individual
function Verse({ children, className = '' }: VerseProps) {
  return (
    <div className={`poetry-verse leading-relaxed ${className}`}>
      {children}
    </div>
  );
}

export const Poetry = {
  Root: PoetryRoot,
  Stanza: Stanza,
  Verse: Verse,
};