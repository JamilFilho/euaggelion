'use client';

import { useNavigation } from '@/lib/context/NavigationContext';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbSchema } from '@/lib/schema';
import { useEffect, useState } from 'react';

export function NavigationLayer() {
  const { breadcrumbItems, secondaryNav } = useNavigation();
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    
    // Observer para mudanças no header
    const header = document.querySelector('header');
    const observer = header ? new ResizeObserver(updateHeaderHeight) : null;
    if (header && observer) {
      observer.observe(header);
    }
    
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      observer?.disconnect();
    };
  }, []);

  return (
    <>
      {/* Navegação secundária (ex: BibleVersionSelector) */}
      {secondaryNav}
      
      {/* Breadcrumb com position fixed puro - completamente isolado do DOM */}
      {breadcrumbItems.length > 0 && (
        <>
          <BreadcrumbSchema
            items={breadcrumbItems.map((item) => ({
              name: item.label,
              url: `https://euaggelion.com.br${item.href}`,
            }))}
          />
          
          <nav
            aria-label="breadcrumb"
            className="fixed left-0 right-0 z-[800] print:hidden px-10 py-6 border-t border-b border-ring/20 flex items-center gap-2 text-sm overflow-hidden min-w-0 bg-secondary transition-all duration-300 ease-in-out"
            style={{ top: `${headerHeight}px` }}
          >
            <ol className="flex items-center gap-2 min-w-0 whitespace-nowrap overflow-hidden">
              {breadcrumbItems.map((item, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-2 ${index === breadcrumbItems.length - 1 ? "flex-1 min-w-0" : "shrink-0"}`}
                >
                  {index > 0 && (
                    <ChevronRight className="size-4 text-muted-foreground" />
                  )}
                  {index === breadcrumbItems.length - 1 ? (
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
      )}
    </>
  );
}
