/**
 * Breadcrumb Component
 * Navegação estruturada com schema JSON-LD
 */

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BreadcrumbSchema } from "@/lib/schema";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <>
      {/* Schema JSON-LD */}
      <BreadcrumbSchema
        items={items.map((item) => ({
          name: item.label,
          url: item.href,
        }))}
      />

      {/* Visual Breadcrumb */}
      <nav
        aria-label="breadcrumb"
        className={`flex flex-wrap items-center gap-2 text-sm ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              {index === items.length - 1 ? (
                <span className="text-foreground font-medium">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
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
