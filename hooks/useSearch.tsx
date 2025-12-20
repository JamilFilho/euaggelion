import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";

interface SearchItem {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  date: string;
}

export function useSearch(query: string) {
  const [items, setItems] = useState<SearchItem[]>([]);

  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then(setItems);
  }, []);

  const fuse = useMemo(() => {
    if (!items.length) return null;

    return new Fuse(items, {
      keys: [
        { name: "title", weight: 0.5 },
        { name: "description", weight: 0.3 },
        { name: "content", weight: 0.2 },
      ],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [items]);

  if (!query || !fuse) return [];

  return fuse.search(query).map((result) => result.item);
}
