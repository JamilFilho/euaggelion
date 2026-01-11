'use client';

import React, { ReactNode } from 'react';
import { useSticky } from '@/hooks/useSticky';

interface StickyWrapperProps {
  children: ReactNode;
  topOffset?: number;
  className?: string;
}

export function StickyWrapper({ children, topOffset = 0, className = '' }: StickyWrapperProps) {
  const { ref } = useSticky({ topOffset });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
