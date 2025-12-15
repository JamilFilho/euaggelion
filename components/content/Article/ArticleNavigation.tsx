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
        <Link href={`/${prev.slug}`} className="justify-end text-right hover:bg-black/10 focus:bg-black/10">
            <span className="col-span-2">{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}

      {/* Botão Próximo */}
      {next ? (
        <Link href={`/${next.slug}`} className="justify-start text-left hover:bg-black/10 focus:bg-black/10">
          {next.title}
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

// Versão alternativa com cards expandidos (versão original com melhorias)
export function ArticleNavigationExpanded({
  prev,
  next,
  category,
}: ArticleNavigationProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <nav
      className="border-t border-ring/20 mt-12 pt-8"
      aria-label="Navegação entre artigos"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Artigo Anterior */}
        {prev ? (
          <Link
            href={`/${prev.slug}`}
            className="group flex flex-col gap-2 p-6 rounded-lg border border-ring/20 hover:border-ring/40 hover:bg-accent/5 transition-all"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ChevronLeft className="w-4 h-4" />
              <span>Artigo anterior</span>
            </div>
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
              {prev.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {prev.description}
            </p>
          </Link>
        ) : (
          <div />
        )}

        {/* Próximo Artigo */}
        {next && (
          <Link
            href={`/${next.slug}`}
            className="group flex flex-col gap-2 p-6 rounded-lg border border-ring/20 hover:border-ring/40 hover:bg-accent/5 transition-all text-right md:col-start-2"
          >
            <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
              <span>Próximo artigo</span>
              <ChevronRight className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
              {next.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {next.description}
            </p>
          </Link>
        )}
      </div>

      {/* Botão de voltar para categoria */}
      <div className="mt-6 flex justify-center">
        <Button variant="outline" asChild>
          <Link href={`/s/${category}`} className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Ver todos os artigos
          </Link>
        </Button>
      </div>
    </nav>
  );
}