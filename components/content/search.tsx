"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearch } from "@/hooks/useSearch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

export function SearchContent() {
  const [query, setQuery] = useState("");
  const results = useSearch(query);
  const [open, setOpen] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) setQuery("")
      }}
    >
      <DialogHeader className="hidden">
        <DialogTitle>Pesquisar no Euaggelion</DialogTitle>
      </DialogHeader>
      <DialogTrigger aria-label="Pesquisar no Euaggelion...">
        <Search className="size-5"/>
      </DialogTrigger>
      
      <DialogContent className="p-0 flex h-screen flex-col">
        {/* Campo de busca */}
        <div>
          <input
            type="search"
            placeholder="Digite para pesquisar…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none border-b border-ring/20 py-6 px-4"
          />
        </div>

        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {query && results.length > 0 ? (
            <ul>
              {results.map((item) => {
                const categoryMeta = CATEGORIES[item.category] ?? { name: item.category };
                return (
                  <li key={item.slug} className="border-b border-ring/20 last:border-0">
                    <DialogClose asChild>
                    <Link
                      href={item.slug}
                      className="block p-6 hover:bg-muted"
                    >
                      <p className="mb-2 text-sm text-foreground/60">{categoryMeta.name}</p>
                      <p className="mb-2 text-xl font-medium">{item.title}</p>
                      <p className="text-sm text-foreground/60">
                        {item.description}
                      </p>
                    </Link>
                    </DialogClose>
                  </li>
                );
              })}
            </ul>
          ) : query ? (
            <p className="px-4 py-6 text-sm text-foreground/60">
              Nenhum resultado encontrado.
            </p>
          ) : (
            <p className="px-4 py-6 text-sm text-foreground/60">
              Digite um termo para procurar em nosso conteúdo.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}