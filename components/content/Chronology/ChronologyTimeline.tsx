"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Scaling } from "lucide-react";
import { useChronology } from "@/lib/context/ChronologyContext";
import { usePinch } from "@use-gesture/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BibliaLink from "../Bible/BibliaLink";

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
  reference?: (string | { text: string; url: string })[];
  track?: number; // Para permitir múltiplas "pistas" de eventos paralelos
}

interface ChronologyTimelineProps {
  dataset?: string;
}

export function ChronologyTimeline({ dataset }: ChronologyTimelineProps) {
  const { chronology: contextChronology, datasets: contextDatasets = [], activeFilter } = useChronology();
  const [events, setEvents] = useState<ChronologyEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3); // Escala de zoom (1 = 100%)

  // Configurar pinch-to-zoom com use-gesture
  usePinch(
    ({ offset: [d] }) => {
      const newScale = Math.max(0.3, Math.min(3, d));
      setScale(newScale);
    },
    {
      target: scrollRef,
      eventOptions: { passive: false },
      scaleBounds: { min: 0.3, max: 3 },
      from: () => [scale, 0],
    }
  );

  useEffect(() => {
    const loadEvents = async () => {
      // Determine which datasets to load
      let datasetIdsToLoad: string[] = [];
      
      if (activeFilter === "all" || !activeFilter) {
        datasetIdsToLoad = contextDatasets || [];
      } else if (activeFilter) {
        datasetIdsToLoad = [activeFilter];
      }

      if (datasetIdsToLoad.length === 0) {
        setEvents(contextChronology || []);
        return;
      }

      setLoading(true);
      try {
        const allEvents: ChronologyEvent[] = [...(contextChronology || [])];

        // Carregar todos os datasets selecionados
        for (const datasetId of datasetIdsToLoad) {
          try {
            const response = await fetch(`/api/chronology/${datasetId}`);
            const data = await response.json();
            const datasetEvents = data.events || [];
            allEvents.push(...datasetEvents);
          } catch (error) {
            console.error(`Erro ao carregar dataset ${datasetId}:`, error);
          }
        }

        // Ordenar todos os eventos por ano
        allEvents.sort((a, b) => {
          const aStart = a.yearStart || a.year || 0;
          const bStart = b.yearStart || b.year || 0;
          if (aStart !== bStart) return aStart - bStart;
          return 0;
        });

        setEvents(allEvents);
      } catch (error) {
        console.error("Erro ao carregar datasets:", error);
        setEvents(contextChronology || []);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [activeFilter, contextDatasets, contextChronology]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Função auxiliar para converter mês em valor decimal (0.0 a 0.916)
  const monthToDecimal = (monthName?: string): number => {
    if (!monthName) return 0;
    const months: { [key: string]: number } = {
      'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
      'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
      'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
    };
    const monthIndex = months[monthName.toLowerCase()];
    return monthIndex !== undefined ? monthIndex / 12 : 0;
  };

  // Função para obter data decimal (ano + fração do mês)
  const getDecimalDate = (year?: number, month?: string): number => {
    const y = year || 0;
    return y + monthToDecimal(month);
  };

  // Calcular intervalo de anos (considerando meses)
  const minYear = events.length > 0 
    ? Math.min(...events.map(e => getDecimalDate(e.yearStart || e.year, e.monthStart || e.month))) 
    : 0;
  const maxYear = events.length > 0 
    ? Math.max(...events.map(e => getDecimalDate(e.yearEnd || e.year, e.monthEnd || e.month))) 
    : 1;
  const yearRange = maxYear - minYear || 1;
  const pixelsPerYear = 100 * scale; // Pixels por ano na timeline (ajustado pelo zoom)

  // Função para detectar sobreposição de eventos (com margem de segurança visual)
  const doesEventOverlap = (event1: ChronologyEvent, event2: ChronologyEvent): boolean => {
    const e1Start = getDecimalDate(event1.yearStart || event1.year, event1.monthStart || event1.month);
    const e1End = getDecimalDate(event1.yearEnd || event1.year, event1.monthEnd || event1.month);
    const e2Start = getDecimalDate(event2.yearStart || event2.year, event2.monthStart || event2.month);
    const e2End = getDecimalDate(event2.yearEnd || event2.year, event2.monthEnd || event2.month);
    
    // Calcular margem visual (aproximadamente 2% do intervalo total para dar espaço entre eventos)
    const visualMargin = yearRange * 0.02;
    
    // Retorna true se há sobreposição considerando a margem visual
    return !(e1End + visualMargin < e2Start || e2End + visualMargin < e1Start);
  };

  // Distribuir eventos em pistas (tracks) baseado em sobreposição
  const trackAssignments: Map<ChronologyEvent, number> = new Map();
  
  events.forEach((event, index) => {
    // Encontrar a primeira pista disponível onde não há sobreposição
    let assignedTrack = 0;
    let trackFound = false;
    
    while (!trackFound) {
      trackFound = true;
      
      // Verificar se existe sobreposição com algum evento já atribuído nesta pista
      for (let i = 0; i < index; i++) {
        const otherEvent = events[i];
        const otherTrack = trackAssignments.get(otherEvent);
        
        if (otherTrack === assignedTrack && doesEventOverlap(event, otherEvent)) {
          // Há sobreposição nesta pista, tentar a próxima
          assignedTrack++;
          trackFound = false;
          break;
        }
      }
    }
    
    trackAssignments.set(event, assignedTrack);
  });

  // Obter número máximo de pistas necessárias
  const maxTracks = Math.max(...Array.from(trackAssignments.values()), 0) + 1;

  // Calcular posição e largura de cada evento (considerando meses)
  const getEventStyle = (event: ChronologyEvent) => {
    const startDate = getDecimalDate(event.yearStart || event.year, event.monthStart || event.month);
    const endDate = getDecimalDate(event.yearEnd || event.year, event.monthEnd || event.month);
    const start = startDate - minYear;
    const duration = endDate - startDate;
    const left = (start / yearRange) * 100;
    const width = duration > 0 ? (duration / yearRange) * 100 : Math.max(2, 100 / yearRange); // Mínimo 2% ou 1 ano
    
    return {
      left: `${left}%`,
      width: `${width}%`,
    };
  };

  // Gerar marcadores de anos (apenas anos inteiros, sem meses)
  const yearMarkers = [];
  const minYearInt = Math.floor(minYear);
  const maxYearInt = Math.ceil(maxYear);
  const yearRangeInt = maxYearInt - minYearInt;
  const yearStep = yearRangeInt > 100 ? 20 : yearRangeInt > 50 ? 10 : yearRangeInt > 20 ? 5 : 1;
  for (let year = Math.floor(minYearInt / yearStep) * yearStep; year <= maxYearInt; year += yearStep) {
    if (year >= minYearInt) {
      yearMarkers.push(year);
    }
  }

  if (loading) {
    return (
      <div className="px-10 py-12 flex items-center justify-center text-muted-foreground">
        Carregando cronologia...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="px-10 py-12 flex items-center justify-center text-muted-foreground">
        Nenhum evento cronológico disponível.
      </div>
    );
  }

  return (
    <div className="relative -mt-12 border-t border-ring/20">
      {/* Zoom Controls (Desktop) */}
      <div className="hidden md:flex absolute right-2 top-2 gap-2 items-center bg-secondary/80 backdrop-blur-sm border border-ring/20 rounded-lg p-1 z-[5]">
        <button
          onClick={() => setScale(Math.max(0.3, scale - 0.2))}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-ring/20 transition-colors text-sm font-bold"
          aria-label="Diminuir zoom"
        >
          −
        </button>
        <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale(Math.min(3, scale + 0.2))}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-ring/20 transition-colors text-sm font-bold"
          aria-label="Aumentar zoom"
        >
          +
        </button>
      </div>

      {/* Scroll Buttons */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-secondary border border-ring/20 rounded-full p-2 hover:bg-ring/20 transition-colors"
        aria-label="Rolar para esquerda"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-secondary border border-ring/20 rounded-full p-2 hover:bg-ring/20 transition-colors"
        aria-label="Rolar para direita"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Timeline Container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-thin scrollbar-thumb-ring/20 scrollbar-track-transparent touch-pan-x"
        style={{ 
          scrollbarWidth: "thin"
        }}
      >
        <div className="px-4 md:px-20 relative" style={{ minWidth: `${yearRange * pixelsPerYear}px` }}>
          {/* Régua de Anos */}
          <div className="relative h-12">
            {yearMarkers.map(year => {
              const position = ((year - minYear) / yearRange) * 100;
              return (
                <div
                  key={year}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${position}%` }}
                >
                  <div className="w-px h-3 bg-ring/40" />
                  <span className="text-xs text-muted-foreground mt-1 font-medium">
                    {year < 0 ? `${Math.abs(year)} a.C.` : year === 0 ? '0' : `${year} d.C.`}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="my-8">
          {/* Tracks de Eventos */}
          {Array.from({ length: maxTracks }).map((_, trackIndex) => (
            <div key={trackIndex} className="mb-2">
              {/* Container de Eventos */}
              <div className="relative h-8">
                {events
                  .filter(event => (trackAssignments.get(event) || 0) === trackIndex)
                  .map((event, index) => {
                    const style = getEventStyle(event);
                    const colorClasses = [
                      'bg-blue-500/80 hover:bg-blue-500',
                      'bg-green-500/80 hover:bg-green-500',
                      'bg-purple-500/80 hover:bg-purple-500',
                      'bg-orange-500/80 hover:bg-orange-500',
                      'bg-pink-500/80 hover:bg-pink-500',
                      'bg-red-500/80 hover:bg-red-500',
                      'bg-indigo-500/80 hover:bg-indigo-500',
                    ];
                    const colorClass = colorClasses[events.indexOf(event) % colorClasses.length];

                    return (
                      <Popover key={`${event.yearStart || event.year}-${index}`}>
                        <PopoverTrigger asChild>
                          <button
                            className={`absolute h-8 ${colorClass} transition-all cursor-pointer hover:z-10`}
                            style={style}
                          >
                            <span className="text-xs text-white font-medium px-2 truncate block">
                              {event.event}
                            </span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            {/* Ano/Data */}
                            <div className="text-xs text-muted-foreground">
                              {event.yearStart ? (
                                <>
                                  {event.monthStart && `${event.monthStart} de `}
                                  {event.yearStart < 0 ? `${Math.abs(event.yearStart)} a.C.` : `${event.yearStart} d.C.`}
                                  {event.yearEnd && (event.yearEnd !== event.yearStart || event.monthEnd !== event.monthStart) && (
                                    <>
                                      {' - '}
                                      {event.monthEnd && `${event.monthEnd} de `}
                                      {event.yearEnd < 0 ? `${Math.abs(event.yearEnd)} a.C.` : `${event.yearEnd} d.C.`}
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  {event.month && `${event.month} de `}
                                  {event.year && (event.year < 0 ? `${Math.abs(event.year)} a.C.` : `${event.year} d.C.`)}
                                </>
                              )}
                              {event.day && ` • Dia ${event.day}`}
                            </div>

                            {/* Título */}
                            <h3 className="font-semibold text-base text-foreground">
                              {event.event}
                            </h3>

                            {/* Descrição */}
                            <p className="text-sm text-foreground/70 leading-relaxed">
                              {event.description}
                            </p>

                            {/* Referências */}
                            {event.reference && event.reference.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-2 border-t border-ring/20">
                                  {event.reference.map((ref, refIndex) => {
                                    const isObject = typeof ref === 'object';
                                    const text = isObject ? ref.text : ref;
                                    const url = isObject ? ref.url : undefined;
                                    
                                    return (
                                      <div key={refIndex}>
                                        {url ? (
                                          <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs bg-accent/10 text-accent px-2 py-1 rounded hover:bg-accent/20 hover:text-accent-foreground transition-colors inline-block"
                                          >
                                            {text} ↗
                                          </a>
                                        ) : (
                                          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded inline-block">
                                            <BibliaLink>
                                              {text}
                                            </BibliaLink>
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  })}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Mobile Scroll Hint */}
      <div className="md:hidden text-center text-xs text-muted-foreground pt-4">
        <div>Deslize horizontalmente para ver a linha do tempo</div>
        <div className="flex flex-row items-center justify-center gap-2 mt-1 text-[10px]"><Scaling className="size-[10px]"/> Zoom atual: {Math.round(scale * 100)}%</div>
      </div>
    </div>
  );
}
