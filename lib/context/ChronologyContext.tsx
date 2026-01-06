"use client";

import { createContext, useContext, ReactNode } from "react";

interface ChronologyEvent {
  year: number;
  month?: string;
  day?: string;
  event: string;
  description: string;
  reference?: string[];
}

interface ChronologyContextType {
  chronology?: ChronologyEvent[];
  dataset?: string;
}

const ChronologyContext = createContext<ChronologyContextType>({});

export function useChronology() {
  return useContext(ChronologyContext);
}

interface ChronologyProviderProps {
  children: ReactNode;
  chronology?: ChronologyEvent[];
  dataset?: string;
}

export function ChronologyProvider({ children, chronology, dataset }: ChronologyProviderProps) {
  return (
    <ChronologyContext.Provider value={{ chronology, dataset }}>
      {children}
    </ChronologyContext.Provider>
  );
}
