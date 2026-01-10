'use client';

import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { ReactNode } from 'react';

interface CategoryBreadcrumbProps {
  category: string;
  categoryName: string;
  children: ReactNode;
}

export function CategoryBreadcrumb({ category, categoryName, children }: CategoryBreadcrumbProps) {
  useBreadcrumb([
    { label: "Home", href: "/" },
    { label: "Seções", href: "/s" },
    { label: categoryName, href: `/s/${category}` },
  ]);

  return <>{children}</>;
}
