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

    // Apply highlight classes (marker style, line by line)
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        // Apply marker-style highlighting to the span with the actual text content
        const textSpan = el.querySelector("span.text-lg");
        if (textSpan) {
          textSpan.classList.add("highlight-marker");
        }
      }
    });

    // Scroll to first highlighted element with top margin to prevent navbar overlap
    if (ids.length > 0) {
      const firstId = ids[0];
      const firstEl = document.getElementById(firstId);
      if (firstEl) {
        setTimeout(() => {
          // Calculate navbar height dynamically
          const header = document.querySelector("header");
          const navHeight = header ? header.offsetHeight : 80; // Fallback to 80px if header not found
          
          // Add extra margin for breathing room and breadcrumb/navigation (120px)
          const totalOffset = navHeight + 120;
          const elementPosition = firstEl.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - totalOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }, 100);
      }
    }

    return () => {
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const textSpan = el.querySelector("span.text-lg");
          if (textSpan) {
            textSpan.classList.remove("highlight-marker");
          }
        }
      });
    };
  }, [searchParams]);

  return null;
}
