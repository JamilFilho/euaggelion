"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { generateReadingPlan, PlanScope, PlanSpan, THEMATIC_GROUPS } from "@/lib/readingPlan";
import { Album, CalendarDays, Info, Printer, Sparkles } from "lucide-react";


const scopeLabels: Record<PlanScope, string> = {
  ot: "Antigo Testamento",
  nt: "Novo Testamento",
  both: "Antigo e Novo Testamento",
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

export function PlannerGenerator() {
  const today = useMemo(() => new Date(), []);
  const fallbackGroup = THEMATIC_GROUPS[0] ?? "";

  const [scope, setScope] = useState<PlanScope>("both");
  const [span, setSpan] = useState<PlanSpan>("anual");
  const [chaptersPerDayInput, setChaptersPerDayInput] = useState<string>("3");
  const [group, setGroup] = useState<string>(fallbackGroup);
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

  const thematicGroups = THEMATIC_GROUPS.length > 0 ? THEMATIC_GROUPS : [
    "Pentateuco",
    "Históricos",
    "Poéticos",
    "Profetas",
    "Evangelhos",
    "Cartas",
  ];

  const targetEnd = useMemo(() => {
    const start = parseInputDate(startDateValue);
    const end = new Date(start);
    const spanDays = span === "anual" ? 365 : 183;
    end.setUTCDate(end.getUTCDate() + spanDays - 1);
    return end.toISOString();
  }, [startDateValue, span]);

  return (
    <div className="min-h-fit border-t border-ring/20 grid grid-cols-1 md:grid-cols-3 md:divide-x divide-ring/20">

      <div className="min-h-fit print:hidden col-span-1 flex flex-col gap-4">
        <div className="my-6 flex items-center gap-4 px-8">
          <span className="p-2 rounded-lg bg-primary/10 text-primary">
            <Album className="size-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">Monte seu plano</p>
            <p className="text-lg font-semibold">Escolha como deseja ler</p>
          </div>
        </div>

        <div className="space-y-4 px-8">
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

          <div className="flex flex-row gap-2">
            <div className="w-full space-y-2">
              <label className="text-sm font-medium">Qual será sua leitura?</label>
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
              <div className="w-full space-y-2">
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data de início</label>
            <Input
              type="date"
              value={startDateValue}
              onChange={(event) => setStartDateValue(event.target.value)}
            />
          </div>
        </div>

        <div className="mt-auto flex border-t border-ring/20 *:rounded-none *:w-full *:py-8">
          <Button className="bg-black/20 text-foreground hover:bg-black/40" onClick={handleGeneratePlan} type="button">
            <Sparkles className="mr-2 h-4 w-4" />
            Gerar plano
          </Button>
          {isGenerated && (
            <Button onClick={handlePrint} type="button">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir/Salvar PDF
            </Button>
          )}
        </div>
      </div>

      {!isGenerated && (
        <div className="col-span-1 md:col-span-2 flex items-center justify-center text-center px-10 mx:px-20 py-10 border-t borer-ring/20 md:border-t-0 text-foreground/60">
          Preencha os campos e clique em &quot;Gerar plano&quot;
        </div>
      )}

      {isGenerated && (
        <div className="md:h-[calc(100vh-5rem)] border-t md:border-t-0 border-ring/20 col-span-1 md:col-span-2 print:overflow-visible print:h-auto" id="planner-print">
          {/* Conteúdo visível na tela (detalhes do plano) */}
          <div className="hidden print:block">
            <div className="border-l border-r border-ring/20 w-full px-10 grid grid-cols-4 gap-3 divide-x divide-ring/20">
              <div className="col-span-2 md:col-span-3 py-6">
                <p className="text-sm text-muted-foreground">Plano gerado</p>
                <p className="text-lg font-semibold">
                  {scopeLabels[scope]} - {spanLabels[span]}
                </p>
              </div>

              <div className="col-span-2 md:col-span-1 py-6 flex items-center justify-center">
                {chaptersPerDay} capítulos/dia
              </div>
            </div>

            <Separator className="bg-ring/20" />

            {plan.days.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum plano disponível com os filtros escolhidos.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 print:grid-cols-3">
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

          {/* Detalhes do plano visíveis na tela (conteúdo anterior do popover) */}
          <div className="print:hidden p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Plano gerado</p>
              <p className="text-lg font-semibold">
                {scopeLabels[scope]} - {spanLabels[span]}
              </p>
            </div>

            <Separator className="bg-ring/20" />

            <div className="grid gap-2">
              <SummaryItem label="Capítulos selecionados" value={`${plan.totalChapters}`} />
              <SummaryItem label="Dias necessários" value={`${plan.totalDays} dias`} />
              <SummaryItem label="Início previsto" value={formatDateLabel(plan.startDate)} />
              <SummaryItem label="Fim previsto" value={formatDateLabel(plan.endDate)} />
              <SummaryItem label="Período escolhido" value={`${spanLabels[span]} (${plan.targetDays} dias)`} />
              <SummaryItem label="Término do período" value={formatDateLabel(targetEnd)} />
            </div>

            <Separator className="bg-ring/20" />

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
          </div>
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
