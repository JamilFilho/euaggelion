"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWikiSearch } from "@/hooks/useWikiSearch";
import { Feed } from "@/components/content/Feed";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function WikiSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const { results, loading } = useWikiSearch(query);

  const articles = results.map((item) => ({
    slug: item.slug,
    title: item.title,
    description: item.description,
    category: item.category,
    isWiki: true,
    date: item.date,
  }));

  return (
    <section className="w-full border-b border-ring/20 bg-black/20">
      <form
        className="relative w-full flex flex-row border-b border-ring/20 bg-black/30"
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) router.push(`/wiki/search?q=${encodeURIComponent(query)}`);
        }}
      >
        <Search className="size-5 absolute left-10 top-1/2 -translate-y-1/2 text-foreground/60" />
        <Input
          type="text"
          placeholder="O que vamos estudar hoje?"
          className="w-full h-16 hover:outline-none focus:outline-none px-20 border-0 text-white placeholder:text-white/50 transition-colors"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {loading ? (
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-ring/20">
          <div className="h-32 md:h-48 flex flex-col gap-2 col-span-1">
            <Skeleton className="w-[70%] h-6 rounded-md" />
            <Skeleton className="w-[90%] h-6 rounded-md" />
            <div className="mt-6 flex flex-col gap-1">
              <Skeleton className="w-full h-4 rounded-md" />
              <Skeleton className="w-full h-4 rounded-md" />
              <Skeleton className="w-full h-4 rounded-md" />
            </div>
            <Skeleton className="w-full mt-auto h-8 rounded-md" />
          </div>

          <div className="h-32 md:h-48 flex flex-col gap-2 col-span-1">
            <Skeleton className="w-[70%] h-6 rounded-md" />
            <Skeleton className="w-[90%] h-6 rounded-md" />
            <div className="mt-6 flex flex-col gap-1">
              <Skeleton className="w-full h-4 rounded-md" />
              <Skeleton className="w-full h-4 rounded-md" />
              <Skeleton className="w-full h-4 rounded-md" />
            </div>
            <Skeleton className="w-full mt-auto h-8 rounded-md" />
          </div>

          <div className="h-32 md:h-48 flex flex-col gap-2 col-span-1">
            <Skeleton className="w-[70%] h-6 rounded-md" />
            <Skeleton className="w-[90%] h-6 rounded-md" />
            <div className="mt-6 flex flex-col gap-1">
              <Skeleton className="w-full h-4 rounded-md" />
              <Skeleton className="w-full h-4 rounded-md" />
              <Skeleton className="w-full h-4 rounded-md" />
            </div>
            <Skeleton className="w-full mt-auto h-8 rounded-md" />
          </div>
        </div>
      ) : (
        <Feed.Root
          articles={articles}
          category="wiki"
          itemsPerPage={10}
          emptyMessage={query.trim() === '' ? 'Digite um termo para pesquisar' : 'Nenhum conteúdo encontrado'}
        >
          <Feed.Group>
            <Feed.Articles category="wiki" />
          </Feed.Group>
        </Feed.Root>
      )}
    </section>
  );
}