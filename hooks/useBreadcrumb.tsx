'use client';

import { useEffect } from 'react';
import { useNavigation } from '@/lib/context/NavigationContext';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function useBreadcrumb(items: BreadcrumbItem[]) {
  const { setBreadcrumbItems } = useNavigation();

  useEffect(() => {
    setBreadcrumbItems(items);
    
    return () => {
      setBreadcrumbItems([]);
    };
  }, [items, setBreadcrumbItems]);
}
