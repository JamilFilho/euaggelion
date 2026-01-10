'use client';

import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { ReactNode } from 'react';

interface TrailStepBreadcrumbProps {
  trailSlug: string;
  trailName: string;
  stepTitle: string;
  stepSlug: string;
  children: ReactNode;
}

export function TrailStepBreadcrumb({ trailSlug, trailName, stepTitle, stepSlug, children }: TrailStepBreadcrumbProps) {
  useBreadcrumb([
    { label: "Home", href: "/" },
    { label: "Trilhas", href: "/trilhas" },
    { label: trailName, href: `/trilhas/${trailSlug}` },
    { label: stepTitle, href: `/trilhas/${trailSlug}/${stepSlug}` },
  ]);

  return <>{children}</>;
}
