import algoliasearch from 'algoliasearch';
import { useEffect, useMemo, useState } from 'react';

interface WikiItem {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  date: string;
  related?: string[];
}

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'YOUR_APP_ID';
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || 'YOUR_SEARCH_KEY';
const indexName = 'wiki';

const client = algoliasearch(appId, searchKey);
const index = client.initIndex(indexName);

export function useWikiSearch(query: string) {
  const [results, setResults] = useState<WikiItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);
    index
      .search(query, {
        hitsPerPage: 20,
      })
      .then(({ hits }: { hits: any[] }) => {
        setResults(hits as WikiItem[]);
      })
      .catch((error: unknown) => {
        console.error('Erro na busca:', error);
        setResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  return { results, loading };
}