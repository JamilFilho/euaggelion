"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Article {
  slug: string;
  title: string;
  description: string;
}

interface ArticleNavigationProps {
  prev: Article | null;
  next: Article | null;
  category: string;
}

export function ArticleNavigation({
  prev,
  next,
  category,
}: ArticleNavigationProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <nav className="print:hidden grid grid-cols-2 divide-x divide-ring/20 *:flex *:items-center *:p-6 *:text-foreground/60 *:transition-all *:duration-100 *:ease-in-out"
      aria-label="Navegação entre artigos"
    >
      {prev ? (
        <Link href={`/${prev.slug}`} className="text-lg black:font-normal font-semibold justify-end text-right hover:bg-black/10 focus:bg-black/10">
          {prev.title}
        </Link>
      ) : (
        <div />
      )}

      {/* Botão Próximo */}
      {next ? (
        <Link href={`/${next.slug}`} className="text-lg black:font-normal font-semibold justify-start text-left hover:bg-black/10 focus:bg-black/10">
          {next.title}
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}