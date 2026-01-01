import fs from "fs";
import path from "path";

const BIBLE_PATH = path.join(process.cwd(), "content", "bible");

export interface BibleBookMeta {
  name: string;
  slug: string;
  abbrev: string;
  chapters: number;
}

export interface BibleVersion {
  id: string;
  name: string;
  books: BibleBookMeta[];
}

export interface BibleBookContent {
  name: string;
  abbrev: string;
  chapters: string[][];
}

export function getBibleVersions(): BibleVersion[] {
  const versionsFile = path.join(BIBLE_PATH, "versions.json");
  if (!fs.existsSync(versionsFile)) return [];
  
  const raw = fs.readFileSync(versionsFile, "utf-8");
  return JSON.parse(raw);
}

export function getBibleVersion(versionId: string): BibleVersion | undefined {
  return getBibleVersions().find(v => v.id === versionId);
}

export function getBibleBook(versionId: string, bookSlug: string): BibleBookContent | undefined {
  const bookFile = path.join(BIBLE_PATH, versionId, `${bookSlug}.json`);
  if (!fs.existsSync(bookFile)) return undefined;
  
  const raw = fs.readFileSync(bookFile, "utf-8");
  return JSON.parse(raw);
}

export function getBibleChapter(versionId: string, bookSlug: string, chapter: number): string[] | undefined {
  const book = getBibleBook(versionId, bookSlug);
  if (!book || !book.chapters[chapter - 1]) return undefined;
  
  return book.chapters[chapter - 1];
}
