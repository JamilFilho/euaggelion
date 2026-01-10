'use client';

import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { ReactNode } from 'react';

interface TrailBreadcrumbProps {
  trailSlug: string;
  trailName: string;
  children: ReactNode;
}

export function TrailBreadcrumb({ trailSlug, trailName, children }: TrailBreadcrumbProps) {
  useBreadcrumb([
    { label: "Home", href: "/" },
    { label: "Trilhas", href: "/trilhas" },
    { label: trailName, href: `/trilhas/${trailSlug}` },
  ]);

  return <>{children}</>;
}
