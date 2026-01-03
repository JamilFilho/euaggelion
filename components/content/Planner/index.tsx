"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  generateReadingPlan,
  PlanScope,
  PlanSpan,
  THEMATIC_GROUPS,
} from "@/lib/readingPlan";
import { CalendarDays, Printer, Sparkles } from "lucide-react";

const scopeLabels: Record<PlanScope, string> = {
  ot: "Antigo Testamento",
  nt: "Novo Testamento",
  both: "Ambos",
  group: "Plano temático",
};

const spanLabels: Record<PlanSpan, string> = {
  anual: "Anual",
  semestral: "Semestral",
};

function toInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseInputDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return new Date();
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDateLabel(value: string): string {
  return new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function ReadingDay({
  dayNumber,
  date,
  readings,
}: {
  dayNumber: number;
  date: string;
  readings: { book: string; chapter: number }[];
}) {
  return (
    <div
      className="rounded-lg border border-ring/20 bg-secondary/40 p-4 space-y-2"
      style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
    >
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-medium">Dia {dayNumber}</span>
        <span className="inline-flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          {formatDateLabel(date)}
        </span>
      </div>
      <Separator className="bg-ring/20" />
      <div className="grid gap-2">
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

export function PlannerGenerator() {
  const today = useMemo(() => new Date(), []);
  const [scope, setScope] = useState<PlanScope>("both");
  const [span, setSpan] = useState<PlanSpan>("anual");
  const [chaptersPerDayInput, setChaptersPerDayInput] = useState<string>("3");
  const [group, setGroup] = useState<string>(THEMATIC_GROUPS[0] ?? "");
  const [startDateValue, setStartDateValue] = useState<string>(toInputDate(today));
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  const chaptersPerDay = useMemo(() => {
    const parsed = Number(chaptersPerDayInput);
    if (!Number.isFinite(parsed) || parsed <= 0) return 1;
    return Math.floor(parsed);
  }, [chaptersPerDayInput]);

  const plan = useMemo(() => {
    return generateReadingPlan({
      chaptersPerDay,
      scope,
      span,
      group,
      startDate: parseInputDate(startDateValue),
    });
  }, [chaptersPerDay, scope, span, group, startDateValue]);

  const handleGeneratePlan = () => {
    setIsGenerated(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const thematicGroups = THEMATIC_GROUPS.length > 0 ? THEMATIC_GROUPS : ["Pentateuco", "Históricos", "Poéticos", "Profetas", "Evangelhos", "Cartas"];

  const targetEnd = useMemo(() => {
    const start = parseInputDate(startDateValue);
    const end = new Date(start);
    const spanDays = span === "anual" ? 365 : 183;
    end.setUTCDate(end.getUTCDate() + spanDays - 1);
    return end.toISOString();
  }, [startDateValue, span]);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      <div className="space-y-4 print:hidden h-fit">
        <div className="rounded-xl border border-ring/20 bg-secondary/40 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">Monte seu plano</p>
              <p className="text-lg font-semibold">Escolha como deseja ler</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Capítulos por dia</label>
              <Input
                type="number"
                min={1}
                value={chaptersPerDayInput}
                onChange={(event) => setChaptersPerDayInput(event.target.value)}
                onBlur={() => {
                  if (chaptersPerDayInput.trim() === "") setChaptersPerDayInput("1");
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={span} onValueChange={(value) => setSpan(value as PlanSpan)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  {(["anual", "semestral"] as PlanSpan[]).map((item) => (
                    <SelectItem key={item} value={item}>
                      {spanLabels[item]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Escopo da leitura</label>
              <Select value={scope} onValueChange={(value) => setScope(value as PlanScope)}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o escopo" />
                </SelectTrigger>
                <SelectContent>
                  {(["both", "ot", "nt", "group"] as PlanScope[]).map((item) => (
                    <SelectItem key={item} value={item}>
                      {scopeLabels[item]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {scope === "group" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Grupo temático</label>
                <Select value={group} onValueChange={setGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {thematicGroups.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Data de início</label>
              <Input
                type="date"
                value={startDateValue}
                onChange={(event) => setStartDateValue(event.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button className="w-full" onClick={handleGeneratePlan} type="button">
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar plano
            </Button>
          </div>
        </div>

        {isGenerated && (
          <div className="rounded-xl border border-ring/20 bg-secondary/40 p-5 space-y-3">
            <p className="text-lg font-semibold">Resumo</p>
            <div className="grid gap-3">
              <SummaryItem label="Capítulos selecionados" value={`${plan.totalChapters}`} />
              <SummaryItem label="Dias necessários" value={`${plan.totalDays} dias`} />
              <SummaryItem
                label="Início previsto"
                value={formatDateLabel(plan.startDate)}
              />
              <SummaryItem label="Fim previsto" value={formatDateLabel(plan.endDate)} />
              <SummaryItem label="Período escolhido" value={`${spanLabels[span]} (${plan.targetDays} dias)`} />
              <SummaryItem label="Término do período" value={formatDateLabel(targetEnd)} />
            </div>
            {!plan.fitsInSpan && (
              <p className="text-sm text-amber-600 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                Para concluir dentro do período selecionado, aumente os capítulos diários para pelo menos {Math.ceil(plan.totalChapters / plan.targetDays)}.
              </p>
            )}
            {plan.fitsInSpan && plan.extraDays > 0 && (
              <p className="text-sm text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                Você finalizará {plan.extraDays} dias antes do término do período.
              </p>
            )}

            <div className="flex gap-3">
              <Button className="w-full" onClick={handlePrint} variant="destructive" type="button">
                <Printer className="mr-2 h-4 w-4" />
                Imprimir / Salvar PDF
              </Button>
            </div>
          </div>
        )}
      </div>

      {!isGenerated && (
        <div className="hidden md:flex justify-center items-center text-center text-foreground/60 rounded-xl border border-ring/20 bg-secondary/40 p-10 space-y-4">
            Preencha os dados ao lado e gere um plano de leitura bíblica personalizado. Depois, imprima ou salve em PDF para acompanhar sua jornada de leitura!
        </div>
      )}

      {isGenerated && (
        <div className="border border-ring/20 print:border-none rounded-xl p-5 space-y-4 h-full overflow-y-auto print:overflow-visible print:h-auto" id="planner-print">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Plano gerado</p>
              <p className="text-lg font-semibold">
                {scopeLabels[scope]} — {spanLabels[span]}
              </p>
            </div>
            <Badge variant="outline" className="print:hidden">
              {chaptersPerDay} capítulos/dia
            </Badge>
          </div>

          <Separator className="bg-ring/20" />

          {plan.days.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum plano disponível com os filtros escolhidos.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 print:grid-cols-3">
              {plan.days.map((day) => (
                <ReadingDay
                  key={day.dayNumber}
                  dayNumber={day.dayNumber}
                  date={day.date}
                  readings={day.readings}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-ring/20 px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default PlannerGenerator;
