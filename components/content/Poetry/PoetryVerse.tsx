import { ReactNode } from "react";

interface PoetryVerseProps {
  children: ReactNode;
  className?: string;
}

export function PoetryVerse({ children, className = '' }: PoetryVerseProps) {
  return (
    <div className={`poetry-verse leading-relaxed ${className}`}>
      {children}
    </div>
  );
}