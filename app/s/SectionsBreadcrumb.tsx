'use client';

import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { ReactNode } from 'react';

export function SectionsBreadcrumb({ children }: { children: ReactNode }) {
  useBreadcrumb([
    { label: "Home", href: "/" },
    { label: "Seções", href: "/s" },
  ]);

  return <>{children}</>;
}
