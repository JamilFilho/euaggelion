"use client";

import { ReactNode, useMemo } from "react";
import { ChronologyProvider } from "@/lib/context/ChronologyContext";
import { Chronology } from "./index";

interface ChronologyBlockProps {
  dataChronology?: string;
  "data-chronology"?: string;
  children?: ReactNode;
}

interface MDXChronologyEvent {
  yearStart?: number;
  monthStart?: string;
  yearEnd?: number;
  monthEnd?: string;
  year?: number;
  month?: string;
  day?: string;
  event: string;
  description: string;
  reference?: Array<string | { text: string; url: string }>;
  track?: number;
}

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

/**
 * Converte referências de MDX para o formato esperado pelo ChronologyProvider
 */
function normalizeReferences(
  refs?: Array<string | { text: string; url: string }>
): string[] | undefined {
  if (!refs) return undefined;
  return refs.map((ref) => (typeof ref === "string" ? ref : ref.text));
}

/**
 * Converte eventos do MDX para o formato esperado pelo ChronologyProvider
 * Preserva todos os campos incluindo yearStart, yearEnd, monthStart, monthEnd e track
 */
function normalizeEvents(mdxEvents: MDXChronologyEvent[]): ChronologyEvent[] {
  return mdxEvents.map((event) => ({
    year: event.year,
    yearStart: event.yearStart,
    yearEnd: event.yearEnd,
    month: event.month,
    monthStart: event.monthStart,
    monthEnd: event.monthEnd,
    day: event.day,
    event: event.event,
    description: event.description,
    reference: normalizeReferences(event.reference),
    track: event.track,
  }));
}

/**
 * Componente que renderiza um bloco de cronologia dentro do MDX
 * Espera receber dados de cronologia via atributo data-chronology como JSON
 */
export function ChronologyBlock({
  dataChronology,
  "data-chronology": dataChrono,
  children,
}: ChronologyBlockProps) {
  const events = useMemo<ChronologyEvent[]>(() => {
    const data = dataChronology || dataChrono;
    if (!data) return [];

    try {
      const parsed: MDXChronologyEvent[] = JSON.parse(data);
      const mdxEvents = Array.isArray(parsed) ? parsed : [parsed];
      return normalizeEvents(mdxEvents);
    } catch (error) {
      console.error("Erro ao fazer parse dos dados de cronologia:", error);
      return [];
    }
  }, [dataChronology, dataChrono]);

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="mt-20 w-screen relative left-1/2 -ml-[50vw] overflow-visible">
      <ChronologyProvider chronology={events}>
        <Chronology.Root>
          <Chronology.Timeline />
        </Chronology.Root>
      </ChronologyProvider>
    </div>
  );
}
