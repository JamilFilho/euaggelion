"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function VerseHighlighter() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const param = searchParams.get("highlight");
    if (!param) return;

    const ids = param.split(",").map(s => s.trim()).filter(Boolean);
    if (ids.length === 0) return;

    // Apply highlight classes (background + text color)
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add("bg-yellow-600");
        el.classList.add("hover:text-foreground");
        el.classList.add("text-secondary");
      }
    });

    return () => {
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.remove("bg-yellow-600");
          el.classList.remove("hover:text-foreground");
          el.classList.remove("text-secondary");
        }
      });
    };
  }, [searchParams]);

  return null;
}
