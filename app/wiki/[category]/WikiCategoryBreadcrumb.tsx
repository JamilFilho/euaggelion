'use client';

import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { ReactNode } from 'react';

interface WikiCategoryBreadcrumbProps {
  categorySlug: string;
  categoryName: string;
  children: ReactNode;
}

export function WikiCategoryBreadcrumb({ categorySlug, categoryName, children }: WikiCategoryBreadcrumbProps) {
  useBreadcrumb([
    { label: "Home", href: "/" },
    { label: "Wiki", href: "/wiki" },
    { label: categoryName, href: `/wiki/${categorySlug}` },
  ]);

  return <>{children}</>;
}
