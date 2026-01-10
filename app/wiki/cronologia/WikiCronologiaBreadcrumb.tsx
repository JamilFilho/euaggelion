'use client';

import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { ReactNode } from 'react';

export function WikiCronologiaBreadcrumb({ children }: { children: ReactNode }) {
  useBreadcrumb([
    { label: "Home", href: "/" },
    { label: "Wiki", href: "/wiki" },
    { label: "Cronologia", href: "/wiki/cronologia" },
  ]);

  return <>{children}</>;
}
