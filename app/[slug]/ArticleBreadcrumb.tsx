'use client';

import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { ReactNode } from 'react';

interface ArticleBreadcrumbProps {
  articleTitle: string;
  articleSlug: string;
  children: ReactNode;
}

export function ArticleBreadcrumb({ articleTitle, articleSlug, children }: ArticleBreadcrumbProps) {
  useBreadcrumb([
    { label: "Home", href: "/" },
    { label: articleTitle, href: `/${articleSlug}` },
  ]);

  return <>{children}</>;
}
