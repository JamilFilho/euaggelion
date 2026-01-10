/**
 * Breadcrumb Component
 * Navegação estruturada com schema JSON-LD
 */

'use client';

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BreadcrumbSchema } from "@/lib/schema";
import { useSticky } from "@/hooks/useSticky";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  sticky?: boolean;
  topOffset?: number;
}

export function Breadcrumb({ items, className = "", sticky = false, topOffset = 0 }: BreadcrumbProps) {
  const pathname = usePathname();
  
  const { ref, placeholderRef } = useSticky({ topOffset, id: 'sticky-breadcrumb' });
  
  // Always use useSticky when sticky is enabled
  const navRef = sticky ? ref : null;
  const placeholderDiv = sticky ? placeholderRef : null;

  return (
    <>
      {sticky && <div ref={placeholderDiv} className="m-0 p-0 h-0" />}
      {/* Schema JSON-LD */}
      <BreadcrumbSchema
        items={items.map((item) => ({
          name: item.label,
          url: item.href,
        }))}
      />

      <nav
        ref={navRef}
        aria-label="breadcrumb"
        className={`z-[800] print:hidden px-10 py-6 -mt-[1px] border-t border-b border-ring/20 flex items-center gap-2 text-sm overflow-hidden min-w-0 bg-secondary transition-all duration-300 ease-in-out ${className}`}
      >
        <ol className="flex items-center gap-2 min-w-0 whitespace-nowrap overflow-hidden">
          {items.map((item, index) => (
            <li
              key={index}
              className={`flex items-center gap-2 ${index === items.length - 1 ? "flex-1 min-w-0" : "shrink-0"}`}
            >
              {index > 0 && (
                <ChevronRight className="size-4 text-muted-foreground" />
              )}
              {index === items.length - 1 ? (
                <span className="text-foreground font-medium truncate min-w-0">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export default Breadcrumb;
