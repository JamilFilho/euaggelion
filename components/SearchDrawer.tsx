"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchDrawer() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Search className="size-5 cursor-pointer" />
      </DrawerTrigger>
      <DrawerContent>
        <div className="h-40 p-0">
            <DrawerHeader>
            <DrawerTitle className="text-xl md:text-2xl">Pesquisa</DrawerTitle>
            <DrawerDescription>Digite a palavra que deseja pesquisar</DrawerDescription>
            </DrawerHeader>
            <form onSubmit={handleSearch} className="absolute bottom-0 left-0 w-full grid grid-cols-5 p-0 border-t border-ring/20 bg-black/20">
                <Input
                    type="text"
                    placeholder="Digite sua pesquisa..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full col-span-3 rounded-none border-0 px-10 py-8 focus:outline-none"
                    required
                />
                <Button type="submit" className="w-full h-full rounded-none col-span-2 text-foreground bg-black/10 hover:bg-black/30 focus:bg-black/30 focus:outline-none">Pesquisar</Button>
            </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}