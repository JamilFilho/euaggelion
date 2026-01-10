'use client';

import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { ReactNode } from 'react';

export function PlannersBreadcrumb({ children }: { children: ReactNode }) {
  useBreadcrumb([
    { label: "Home", href: "/" },
    { label: "Planos de Leitura", href: "/planners" },
  ]);

  return <>{children}</>;
}
