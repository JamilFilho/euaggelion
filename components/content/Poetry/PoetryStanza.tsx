import { ReactNode } from "react";

interface PoetryStanzaProps {
  children: ReactNode;
  className?: string;
}

export function PoetryStanza({ children, className = '' }: PoetryStanzaProps) {
  return (
    <div className={`poetry-stanza mb-10 last:mb-0 ${className}`}>
      {children}
    </div>
  );
}