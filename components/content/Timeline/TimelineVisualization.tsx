"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Scaling, MapPin, FlagTriangleRightIcon, FlagTriangleRight, Bookmark, MessageSquareQuote, GitCommitVertical } from "lucide-react";
import { usePinch } from "@use-gesture/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BibliaLink from "../Bible/BibliaLink";

interface PinData {
  event: string;
  description: string;
  reference?: string[];
}

interface EventPin extends PinData {
  position: number;
}

interface TimelineEvent {
  name?: string; // Nome do evento
  description?: string; // Descrição do evento
  reference?: string[]; // Referências do evento
  startPosition?: number; // Posição inicial do evento na timeline (0 = início)
  start?: PinData;
  end?: PinData;
  range?: number;
  track?: number; // Track/linha onde o evento será renderizado (para sobreposições)
  [key: string]: any; // Para permitir event pins dinâmicos
}

interface TimelineData {
  name: string;
  description?: string;
  events: TimelineEvent[];
}

interface TimelineVisualizationProps {
  data: TimelineData;
}

export function TimelineVisualization({ data }: TimelineVisualizationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  // Configurar pinch-to-zoom com use-gesture
  usePinch(
    ({ offset: [d] }) => {
      const newScale = Math.max(1, Math.min(3, d));
      setScale(newScale);
    },
    {
      target: scrollRef,
      eventOptions: { passive: false },
      scaleBounds: { min: 0.03, max: 3 },
      from: () => [scale, 0],
    }
  );

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Processar eventos para extrair os event pins e calcular posições
  const processedEvents = data.events.map((event, index) => {
    const range = event.range || 3;
    const eventPins: EventPin[] = [];
    
    // Se não tem startPosition definida, calcular sequencialmente
    let startPosition = event.startPosition;
    if (startPosition === undefined) {
      // Modo sequencial: cada evento começa após o anterior
      startPosition = data.events.slice(0, index).reduce((sum, e) => {
        return sum + (e.range || 3);
      }, 0);
    }

    // Adicionar pin do start no início do evento (position 0)
    if (event.start) {
      eventPins.push({
        event: event.start.event || "Início",
        description: event.start.description || "",
        reference: event.start.reference || [],
        position: 0,
      });
    }

    // Procurar por propriedades que não sejam start, end, range, startPosition ou track
    Object.keys(event).forEach((key) => {
      if (key !== "start" && key !== "end" && key !== "range" && key !== "startPosition" && key !== "track") {
        const pinData = event[key];
        if (pinData && typeof pinData === "object" && pinData.position) {
          eventPins.push({
            event: pinData.event || key,
            description: pinData.description || "",
            reference: pinData.reference || [],
            position: pinData.position,
          });
        }
      }
    });

    // Adicionar pin do end no final do evento (position = range)
    if (event.end) {
      eventPins.push({
        event: event.end.event || "Fim",
        description: event.end.description || "",
        reference: event.end.reference || [],
        position: range,
      });
    }

    return {
      ...event,
      range,
      startPosition,
      eventPins,
      track: event.track || 0,
    };
  });

  // Calcular largura total baseada na posição mais distante
  const maxEndPosition = Math.max(
    ...processedEvents.map(event => (event.startPosition || 0) + event.range)
  );
  const totalUnits = maxEndPosition;
  const pixelsPerUnit = 150 * scale;

  // Agrupar eventos por track
  const eventsByTrack = processedEvents.reduce((acc, event) => {
    const track = event.track || 0;
    if (!acc[track]) acc[track] = [];
    acc[track].push(event);
    return acc;
  }, {} as Record<number, typeof processedEvents>);

  const maxTrack = Math.max(...Object.keys(eventsByTrack).map(Number));

  if (!data || !data.events || data.events.length === 0) {
    return (
      <div className="px-10 py-12 flex items-center justify-center text-muted-foreground">
        Nenhum evento disponível para exibir na timeline.
      </div>
    );
  }

  const colorClasses = [
    'bg-blue-500/80 hover:bg-blue-500',
    'bg-green-500/80 hover:bg-green-500',
    'bg-purple-500/80 hover:bg-purple-500',
    'bg-orange-500/80 hover:bg-orange-500',
    'bg-pink-500/80 hover:bg-pink-500',
    'bg-red-500/80 hover:bg-red-500',
    'bg-indigo-500/80 hover:bg-indigo-500',
    'bg-sky-500/80 hover:bg-sky-500',
    'bg-cyan-500/80 hover:bg-cyan-500',
    'bg-teal-500/80 hover:bg-teal-500',
  ];

  return (
    <div className="relative -mt-12 border-t border-ring/20">
      {/* Zoom Controls (Desktop) */}
      <div className="hidden md:flex absolute right-2 top-2 gap-2 items-center bg-secondary/80 backdrop-blur-sm border border-ring/20 rounded-lg p-1 z-[5]">
        <button
          onClick={() => setScale(Math.max(0.05, scale - 0.2))}
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
        className="py-6 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-ring/20 scrollbar-track-transparent touch-pan-x"
        style={{ 
          scrollbarWidth: "thin"
        }}
      >
        <div className="px-4 md:px-20 py-8 relative" style={{ minWidth: `${totalUnits * pixelsPerUnit}px` }}>
          {/* Timeline Track */}
          <div className="relative" style={{ minHeight: `${(maxTrack + 1) * 60}px` }}>
            {/* Eventos */}
            {Object.entries(eventsByTrack).map(([trackNum, trackEvents]) => {
              const trackIndex = Number(trackNum);
              
              return trackEvents.map((event, index) => {
                const startPosition = event.startPosition || 0;
                const eventWidth = event.range * pixelsPerUnit;
                
                const colorClass = colorClasses[processedEvents.indexOf(event) % colorClasses.length];

                return (
                  <div
                    key={`${trackIndex}-${index}`}
                    className="absolute"
                    style={{
                      left: `${startPosition * pixelsPerUnit}px`,
                      top: `${trackIndex * 80}px`,
                      width: `${eventWidth}px`,
                      height: '60px'
                    }}
                  >
                    {/* Barra do evento com nome */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={`absolute top-1/2 -translate-y-1/2 w-full h-10 ${colorClass} transition-all cursor-pointer`}
                        >
                          <span className="text-left text-xs text-white font-medium px-2 truncate block leading-10">
                            {event.name || event.start?.event || event.end?.event || 'Evento'}
                          </span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          {/* Título do Evento */}
                          <h3 className="font-semibold text-base text-foreground">
                            {event.name || 'Evento'}
                          </h3>

                          {/* Descrição do Evento */}
                          {event.description && (
                            <p className="text-sm text-foreground/70 leading-relaxed">
                              {event.description}
                            </p>
                          )}

                          {/* Referências do Evento */}
                          {event.reference && event.reference.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-2 border-t border-ring/20">
                              {event.reference.map((ref, refIndex) => (
                                <span key={refIndex} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded inline-block">
                                  <BibliaLink>{ref}</BibliaLink>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* Event Pins */}
                    {event.eventPins && event.eventPins.map((pin: EventPin, pinIndex: number) => {
                      // Calcular posição relativa ao início da track (dentro do container do evento)
                      const pinRelativePosition = (pin.position / event.range) * event.range * pixelsPerUnit;
                      
                      return (
                        <div key={pinIndex} style={{ position: 'absolute', left: `${pinRelativePosition}px`, top: '0', transform: 'translateX(-50%)', height: '100%' }}>
                          {/* Linha do pin até embaixo da track */}
                          <div className="absolute left-[50%] top-[8px] w-[2px] h-[80%] bg-foreground -translate-x-[50%] z-[400]" />
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                className="absolute w-5 h-5 hover:scale-110 transition-transform z-10 cursor-pointer -top-[6px] left-[50%] -translate-x-[50%]"
                              >
                                <GitCommitVertical
                                  className="w-full h-full text-foreground"
                                />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-2">
                                <h3 className="font-semibold text-base text-foreground">
                                  {pin.event}
                                </h3>
                                <p className="text-sm text-foreground/70 leading-relaxed">
                                  {pin.description}
                                </p>
                                {pin.reference && pin.reference.length > 0 && (
                                  <div className="flex flex-wrap gap-1 pt-2 border-t border-ring/20">
                                    {pin.reference.map((ref, refIndex) => (
                                      <span key={refIndex} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded inline-block">
                                        <BibliaLink>{ref}</BibliaLink>
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      );
                    })}
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>

      {/* Mobile Scroll Hint */}
      <div className="md:hidden text-center text-xs text-muted-foreground pt-4">
        <div>Deslize horizontalmente para ver a timeline</div>
        <div className="flex flex-row items-center justify-center gap-2 mt-1 text-[10px]">
          <Scaling className="size-[10px]"/> Zoom atual: {Math.round(scale * 100)}%
        </div>
      </div>
    </div>
  );
}
