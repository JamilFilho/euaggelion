'use client';

import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { ReactNode } from 'react';

export function TrailsBreadcrumb({ children }: { children: ReactNode }) {
  useBreadcrumb([
    { label: "Home", href: "/" },
    { label: "Trilhas", href: "/trilhas" },
  ]);

  return <>{children}</>;
}
