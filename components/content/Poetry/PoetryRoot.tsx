import { ReactNode } from "react";

interface PoetryRootProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function PoetryRoot({ children, align = 'center', className = '' }: PoetryRootProps) {
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
