import algoliasearch from 'algoliasearch';
import { useEffect, useState } from "react";

interface SearchItem {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  date: string;
  author: string;
}

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'YOUR_APP_ID';
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || process.env.ALGOLIA_ADMIN_KEY || 'YOUR_SEARCH_KEY';
const client = algoliasearch(appId, searchKey);

export function useSearch(query: string) {
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const searchIndexes = async () => {
      try {
        const [wikiResults, articlesResults] = await Promise.all([
          client.initIndex('wiki').search(query),
          client.initIndex('articles').search(query),
        ]);

        const combined = [
          ...wikiResults.hits.map((hit: any) => ({
            slug: hit.slug,
            title: hit.title,
            description: hit.description,
            content: hit.content,
            category: hit.category,
            date: hit.date,
            author: hit.author || '',
          })),
          ...articlesResults.hits.map((hit: any) => ({
            slug: hit.slug,
            title: hit.title,
            description: hit.description,
            content: hit.content,
            category: hit.category,
            date: hit.date,
            author: hit.author || '',
          })),
        ];

        // Remove duplicates based on slug
        const uniqueResults = combined.filter((item, index, self) =>
          index === self.findIndex((t) => t.slug === item.slug)
        );

        setResults(uniqueResults);
      } catch (error) {
        console.error('Erro na busca:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchIndexes();
  }, [query]);

  return { results, isLoading };
}
