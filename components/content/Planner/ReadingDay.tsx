import { ReactNode } from "react";
import { CalendarDays } from "lucide-react";

interface ReadingDayProps {
  dayNumber: number;
  date: string;
  readings: { book: string; chapter: number }[];
}

export function ReadingDay({ dayNumber, date, readings }: ReadingDayProps) {
  function formatDateLabel(value: string): string {
    return new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  }

  return (
    <div className="border-t border-b border-r border-l border-ring/20 py-4 hover:bg-black/20 transition-colors ease-in-out" style={{ breakInside: "avoid", pageBreakInside: "avoid" }} >
      <div className="px-4 flex items-center justify-between text-sm text-foreground/60 border-b border-ring/20 pb-4">
        <span className="font-medium">Dia {dayNumber}</span>
        <span className="inline-flex items-center gap-2">
          <CalendarDays className="size-4" />
          {formatDateLabel(date)}
        </span>
      </div>
      <div className="px-4 mt-4 grid gap-2">
        {readings.map((reading, index) => {
          const passageId = `day-${dayNumber}-reading-${index}`;
          return (
            <label key={passageId} className="flex items-start gap-0 print:gap-3 text-base leading-relaxed">
              <input
                id={passageId}
                type="checkbox"
                aria-label={`Concluir ${reading.book} ${reading.chapter}`}
                className="hidden print:block mt-1 h-5 w-5 rounded border border-ring/30 accent-primary"
              />
              <span>{`${reading.book} ${reading.chapter}`}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}