'use client';

import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { ReactNode } from 'react';

interface WikiArticleBreadcrumbProps {
  categorySlug: string;
  categoryName: string;
  articleTitle: string;
  articleSlug: string;
  children: ReactNode;
}

export function WikiArticleBreadcrumb({ categorySlug, categoryName, articleTitle, articleSlug, children }: WikiArticleBreadcrumbProps) {
  useBreadcrumb([
    { label: "Home", href: "/" },
    { label: "Wiki", href: "/wiki" },
    { label: categoryName, href: `/wiki/${categorySlug}` },
    { label: articleTitle, href: `/wiki/${categorySlug}/${articleSlug}` },
  ]);

  return <>{children}</>;
}
