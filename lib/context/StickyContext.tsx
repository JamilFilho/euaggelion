'use client';

import React, { createContext, useContext, ReactNode, useCallback, useRef } from 'react';

interface StickyElement {
  id: string;
  height: number;
  order: number;
}

interface StickyContextType {
  registerStickyElement: (id: string, height: number) => void;
  unregisterStickyElement: (id: string) => void;
  getStickyOffset: (id: string, baseOffset: number) => number;
  setElementSticky: (id: string, isSticky: boolean) => void;
  getTotalStickyHeight: () => number;
  elements: StickyElement[];
}

const StickyContext = createContext<StickyContextType | undefined>(undefined);

// Define ordem fixa baseada em IDs conhecidos
const getOrderPriority = (id: string): number => {
  if (id === 'sticky-header') return 0;
  if (id === 'sticky-breadcrumb') return 1;
  if (id.startsWith('sticky-section')) return 2;
  return 99; // outros elementos
};

export function StickyProvider({ children }: { children: ReactNode }) {
  const elementsRef = useRef<Map<string, StickyElement>>(new Map());
  const activeStickyRef = useRef<Set<string>>(new Set());

  const registerStickyElement = useCallback((id: string, height: number) => {
    const newMap = new Map(elementsRef.current);
    const order = getOrderPriority(id);
    newMap.set(id, { id, height, order });
    elementsRef.current = newMap;
  }, []);

  const unregisterStickyElement = useCallback((id: string) => {
    const newMap = new Map(elementsRef.current);
    newMap.delete(id);
    elementsRef.current = newMap;
    activeStickyRef.current.delete(id);
  }, []);

  const setElementSticky = useCallback((id: string, isSticky: boolean) => {
    if (isSticky) {
      activeStickyRef.current.add(id);
    } else {
      activeStickyRef.current.delete(id);
    }
  }, []);

  const getTotalStickyHeight = useCallback(() => {
    let total = 0;
    for (const id of activeStickyRef.current) {
      const element = elementsRef.current.get(id);
      if (element) {
        total += element.height;
      }
    }
    return total;
  }, []);

  const getStickyOffset = useCallback((id: string, baseOffset: number): number => {
    const elementArray = Array.from(elementsRef.current.values()).sort((a, b) => a.order - b.order);
    const currentElement = elementsRef.current.get(id);
    
    if (!currentElement) {
      return baseOffset;
    }

    let totalOffset = baseOffset;
    for (const el of elementArray) {
      if (el.order < currentElement.order) {
        totalOffset += el.height;
      }
    }
    return totalOffset;
  }, []);

  return (
    <StickyContext.Provider value={{ registerStickyElement, unregisterStickyElement, getStickyOffset, setElementSticky, getTotalStickyHeight, elements: Array.from(elementsRef.current.values()) }}>
      {children}
    </StickyContext.Provider>
  );
}

export function useStickContext() {
  const context = useContext(StickyContext);
  if (!context) {
    throw new Error('useStickContext deve ser usado dentro de StickyProvider');
  }
  return context;
}
