"use client";

import { useState, useEffect } from "react";
import { Dictionary } from "./Dictionary";

interface DictionaryLinkProps {
  text: string;
  verbete: string;
}

interface DictionaryEntry {
  slug: string;
  title: string;
  description: string;
  letter: string;
  content: string;
  references: string[];
}

export default function DictionaryLink({ text, verbete }: DictionaryLinkProps) {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await fetch(`/api/dictionary/${encodeURIComponent(verbete)}`);
        if (response.ok) {
          const data = await response.json();
          setEntry(data);
        }
      } catch (error) {
        console.error("Error fetching dictionary entry:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [verbete]);

  if (loading) {
    return <span>{text}</span>; // Loading state
  }

  if (!entry) {
    return <span>{text}</span>; // Fallback se não encontrar
  }

  return (
    <Dictionary.Root>
      <Dictionary.Trigger content={text} />
      <Dictionary.Content content={entry.content} title={entry.title} />
    </Dictionary.Root>
  );
}