'use client';

import { useSticky } from '@/hooks/useSticky';
import { ReactNode } from 'react';

interface StickyHeaderProps {
  children: ReactNode;
  topOffset?: number;
  className?: string;
}

export function StickyHeader({ children, topOffset = 0, className = '' }: StickyHeaderProps) {
  const { ref, placeholderRef } = useSticky({ topOffset, id: 'sticky-header' });

  return (
    <>
      <div ref={placeholderRef} className="m-0 p-0 h-0" />
      <header ref={ref} className={`print:hidden transition-all duration-300 ease-in-out ${className}`}>
        {children}
      </header>
    </>
  );
}
