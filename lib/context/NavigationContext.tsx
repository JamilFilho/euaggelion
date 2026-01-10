'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface NavigationContextType {
  breadcrumbItems: BreadcrumbItem[];
  setBreadcrumbItems: (items: BreadcrumbItem[]) => void;
  secondaryNav: ReactNode | null;
  setSecondaryNav: (nav: ReactNode | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  const [secondaryNav, setSecondaryNav] = useState<ReactNode | null>(null);

  return (
    <NavigationContext.Provider
      value={{
        breadcrumbItems,
        setBreadcrumbItems,
        secondaryNav,
        setSecondaryNav,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
