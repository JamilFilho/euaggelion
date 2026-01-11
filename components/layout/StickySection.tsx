'use client';

import { useSticky } from '@/hooks/useSticky';
import { ReactNode, useMemo } from 'react';

interface StickySectionProps {
  children: ReactNode;
  topOffset?: number;
  className?: string;
  as?: 'div' | 'section' | 'nav';
  id?: string;
}

export function StickySection({ 
  children, 
  topOffset = 0, 
  className = '', 
  as: Component = 'div',
  id
}: StickySectionProps) {
  const sectionId = useMemo(() => id || `sticky-section-${Math.random().toString(36).substr(2, 9)}`, [id]);
  const { ref } = useSticky({ topOffset, id: sectionId });

  return (
    <>
      {Component === 'div' && <div ref={ref} className={`transition-all duration-300 ease-in-out ${className}`}>{children}</div>}
      {Component === 'section' && <section ref={ref} className={`transition-all duration-300 ease-in-out ${className}`}>{children}</section>}
      {Component === 'nav' && <nav ref={ref} className={`transition-all duration-300 ease-in-out ${className}`}>{children}</nav>}
    </>
  );
}
