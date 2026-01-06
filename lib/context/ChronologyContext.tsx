"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface ChronologyEvent {
  year?: number;
  yearStart?: number;
  yearEnd?: number;
  month?: string;
  monthStart?: string;
  monthEnd?: string;
  day?: string;
  event: string;
  description: string;
  reference?: string[];
  track?: number;
}

interface ChronologyContextType {
  chronology?: ChronologyEvent[];
  datasets?: string[]; // Array de datasets para carregar
  activeFilter?: string; // Filtro ativo (qual dataset visualizar)
  setActiveFilter?: (filter: string) => void;
}

const ChronologyContext = createContext<ChronologyContextType>({});

export function useChronology() {
  return useContext(ChronologyContext);
}

interface ChronologyProviderProps {
  children: ReactNode;
  chronology?: ChronologyEvent[];
  datasets?: string[]; // Array de datasets
  activeFilter?: string;
}

export function ChronologyProvider({ 
  children, 
  chronology, 
  datasets = [],
  activeFilter: initialFilter = ""
}: ChronologyProviderProps) {
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);

  return (
    <ChronologyContext.Provider value={{ chronology, datasets, activeFilter, setActiveFilter }}>
      {children}
    </ChronologyContext.Provider>
  );
}
