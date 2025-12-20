"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { count } from "console";

interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  testament?: "at" | "nt";
  isWiki?: boolean;
  count?:number
}

interface CategoryArticlesProps {
  articles: Article[];
  category: string;
}

const ITEMS_PER_PAGE = 12;

export function CategoryArticles({ articles, category }: CategoryArticlesProps) {
  const [testamentFilter, setTestamentFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredArticles = articles.filter((article) => {
    if (testamentFilter === "all") return true;
    return article.testament === testamentFilter;
  });

  // Calcula paginação
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  // Reset para página 1 quando mudar o filtro
  const handleFilterChange = (value: string) => {
    setTestamentFilter(value);
    setCurrentPage(1);
  };

  // Gera array de páginas para exibir
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Se tiver poucas páginas, mostra todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sempre mostra primeira página
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }

      // Páginas ao redor da atual
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      // Sempre mostra última página
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col">
      <section className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ring/20 border-t border-ring/20">
        {category === "verso-a-verso" && (
          <header className="md:col-span-3 flex items-center justify-between md:justify-end md:gap-4 border-b border-ring/20 py-4 px-10">
            <span className="text-foreground/60">Filtrar conteúdo:</span>
            <Select value={testamentFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Ver estudos do..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="at">Antigo Testamento</SelectItem>
                <SelectItem value="nt">Novo Testamento</SelectItem>
              </SelectContent>
            </Select>
          </header>
        )}

        {currentArticles.length === 0 ? (
          <div className="md:col-span-3 p-10 text-center text-foreground/60">
            Nenhum conteúdo encontrado.
          </div>
        ) : (
          currentArticles.map((article, index) => (
            <article
              className={`h-full ${
                index === currentArticles.length - 1 && currentArticles.length % 3 === 1
                  ? "md:col-span-3"
                  : index === currentArticles.length - 1 && currentArticles.length % 3 === 2
                  ? "md:col-span-2"
                  : ""
              }`}
              key={article.slug}
            >
              <Link
                href={article.isWiki ? (category === "wiki" ? `/wiki/${article.slug}` : `/wiki/${category}/${article.slug}`) : (category === "articles" ? `/s/${article.slug}` : `/${article.slug}`)}
                className="flex flex-col gap-4 h-full"
              >
                <header className="pt-12 px-10">
                  <h3 className="text-3xl font-bold line-clamp-2 mb-4">{article.title}</h3>
                  {article.count !== undefined && (
                    <Badge variant="secondary">
                      {article.count === 0 ? (
                        <span>Nenhum artigo</span>
                      ) : article.count === 1 ? (
                        <span>{article.count} artigo</span>
                      ) : (
                        <span>{article.count} artigos</span>
                      )}
                    </Badge>
                  )}
                </header>
                <section className="flex-1 px-10 mb-10">
                  <p className="text-foreground/60 line-clamp-3">{article.description}</p>
                </section>

                <footer className="px-10 py-4 hover:pr-8 flex flex-row justify-between items-center border-t border-ring/20 md:border-b bg-black/10 hover:bg-black/20 transition-all ease-in-out text-sm text-foreground font-semibold">
                    {article.isWiki ? (
                      category === "wiki" ? (
                        <span>Ver artigos</span>
                      ) : (
                        <span>Continuar lendo</span>
                      )
                    ) : (
                      category === "articles" ? (
                        <span>Ver artigos</span>
                      ) : (
                        <span>Continuar lendo</span>
                      )
                    )}
                  <ArrowRight />
                </footer>
              </Link>
            </article>
          ))
        )}
      </section>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="w-full py-8 border-t border-ring/20">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => (
                <PaginationItem key={`${page}-${index}`}>
                  {typeof page === "number" ? (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  ) : (
                    <PaginationEllipsis />
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}