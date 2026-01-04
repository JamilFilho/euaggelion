import booksData from "@/content/bible/books.json";

export type PlanScope = "ot" | "nt" | "both" | "group";
export type PlanSpan = "anual" | "semestral";

export interface PlanOptions {
  chaptersPerDay: number;
  scope: PlanScope;
  span: PlanSpan;
  group?: string;
  startDate?: Date;
}

export interface PlanReading {
  book: string;
  bookSlug: string;
  chapter: number;
  testament: "AT" | "NT";
  group?: string;
}

export interface PlanDay {
  dayNumber: number;
  date: string;
  readings: PlanReading[];
}

export interface PlanResult {
  days: PlanDay[];
  totalChapters: number;
  totalDays: number;
  startDate: string;
  endDate: string;
  targetDays: number;
  fitsInSpan: boolean;
  extraDays: number;
  chaptersPerDay: number;
  scopeUsed: PlanScope;
  span: PlanSpan;
  groupUsed?: string;
}

interface PlannerBook {
  name: string;
  slug: string;
  abbrev: string;
  testament: "AT" | "NT";
  chapters: number;
  group?: string;
}

const PLAN_DAYS: Record<PlanSpan, number> = {
  anual: 365,
  semestral: 183,
};

const BOOKS: PlannerBook[] = booksData as PlannerBook[];
const OT_BOOKS = BOOKS.filter((book) => book.testament === "AT");
const NT_BOOKS = BOOKS.filter((book) => book.testament === "NT");

export const THEMATIC_GROUPS = Array.from(
  new Set(BOOKS.map((book) => book.group).filter(Boolean) as string[])
).sort((a, b) => a.localeCompare(b, "pt"));

function startOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function buildChapterQueue(books: PlannerBook[]): PlanReading[] {
  const queue: PlanReading[] = [];

  books.forEach((book) => {
    for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
      queue.push({
        book: book.name,
        bookSlug: book.slug,
        chapter,
        testament: book.testament,
        group: book.group,
      });
    }
  });

  return queue;
}

function mergeTestaments(otQueue: PlanReading[], ntQueue: PlanReading[]): PlanReading[] {
  const merged: PlanReading[] = [];
  const ot = [...otQueue];
  const nt = [...ntQueue];

  while (ot.length > 0 || nt.length > 0) {
    if (ot.length > 0) {
      merged.push(ot.shift() as PlanReading);
    }

    if (nt.length > 0) {
      merged.push(nt.shift() as PlanReading);
    }
  }

  return merged;
}

function resolveBooks(scope: PlanScope, group?: string): PlanReading[] {
  if (scope === "ot") return buildChapterQueue(OT_BOOKS);
  if (scope === "nt") return buildChapterQueue(NT_BOOKS);

  if (scope === "group") {
    const normalizedGroup = group ?? THEMATIC_GROUPS[0];
    const groupedBooks = BOOKS.filter((book) => book.group === normalizedGroup);
    return buildChapterQueue(groupedBooks);
  }

  const otChapters = buildChapterQueue(OT_BOOKS);
  const ntChapters = buildChapterQueue(NT_BOOKS);
  return mergeTestaments(otChapters, ntChapters);
}

export function generateReadingPlan(options: PlanOptions): PlanResult {
  const start = startOfDay(options.startDate ?? new Date());
  const chaptersPerDay = Math.max(1, Math.floor(options.chaptersPerDay || 1));
  const targetDays = PLAN_DAYS[options.span];
  const readingQueue = resolveBooks(options.scope, options.group);

  const days: PlanDay[] = [];
  for (let index = 0; index < readingQueue.length; index += chaptersPerDay) {
    const readings = readingQueue.slice(index, index + chaptersPerDay);
    const date = addDays(start, days.length);

    days.push({
      dayNumber: days.length + 1,
      date: date.toISOString(),
      readings,
    });
  }

  const totalDays = days.length;
  const fitsInSpan = totalDays <= targetDays;
  const extraDays = fitsInSpan ? targetDays - totalDays : totalDays - targetDays;
  const endDate = days.length > 0 ? days[days.length - 1].date : start.toISOString();

  return {
    days,
    totalChapters: readingQueue.length,
    totalDays,
    startDate: start.toISOString(),
    endDate,
    targetDays,
    fitsInSpan,
    extraDays,
    chaptersPerDay,
    scopeUsed: options.scope,
    span: options.span,
    groupUsed: options.group,
  };
}
