"use client";

import { ReactNode, useMemo } from "react";
import { Timeline } from "./index";

interface TimelineBlockProps {
  dataTimeline?: string;
  "data-timeline"?: string;
  children?: ReactNode;
}

interface PinData {
  event: string;
  description: string;
  reference?: string[];
}

interface EventPin extends PinData {
  position: number;
}

interface TimelineEvent {
  startPosition?: number;
  start?: PinData;
  end?: PinData;
  range?: number;
  track?: number;
  [key: string]: any;
}

interface TimelineData {
  name: string;
  description?: string;
  events: TimelineEvent[];
}

/**
 * Componente que renderiza um bloco de timeline dentro do MDX
 * Espera receber dados de timeline via atributo data-timeline como JSON
 */
export function TimelineBlock({
  dataTimeline,
  "data-timeline": dataTime,
  children,
}: TimelineBlockProps) {
  const timelineData = useMemo<TimelineData | null>(() => {
    const data = dataTimeline || dataTime;
    if (!data) return null;

    try {
      const parsed = JSON.parse(data);
      return parsed as TimelineData;
    } catch (error) {
      console.error("Erro ao fazer parse dos dados de timeline:", error);
      return null;
    }
  }, [dataTimeline, dataTime]);

  if (!timelineData || !timelineData.events || timelineData.events.length === 0) {
    return null;
  }

  return (
    <div className="mt-20 w-screen relative left-1/2 -ml-[50vw] overflow-visible">
      <Timeline.Root>
        <Timeline.Visualization data={timelineData} />
      </Timeline.Root>
    </div>
  );
}
