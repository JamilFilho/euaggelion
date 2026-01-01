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

export interface BibleVersionRaw {
  id: string;
  name: string;
  books: string[]; // Slugs of the books
}

export interface BibleBookContent {
  name: string;
  abbrev: string;
  chapters: string[][];
}

function readJsonFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  
  let raw = fs.readFileSync(filePath, "utf-8");
  
  // Handle UTF-8 BOM (Byte Order Mark)
  if (raw.charCodeAt(0) === 0xFEFF) {
    raw = raw.slice(1);
  }
  
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Error parsing JSON from ${filePath}:`, error);
    return null;
  }
}

export function getBibleBooks(): BibleBookMeta[] {
  const booksFile = path.join(BIBLE_PATH, "books.json");
  return readJsonFile<BibleBookMeta[]>(booksFile) || [];
}

export function getBibleVersions(): BibleVersion[] {
  const versionsFile = path.join(BIBLE_PATH, "versions.json");
  const versionsRaw = readJsonFile<BibleVersionRaw[]>(versionsFile);
  
  if (!versionsRaw) return [];
  
  const allBooks = getBibleBooks();
  const booksMap = new Map(allBooks.map(book => [book.slug.trim(), book]));

  return versionsRaw.map(version => ({
    ...version,
    books: version.books.map(slug => booksMap.get(slug.trim())).filter((book): book is BibleBookMeta => !!book)
  }));
}

export function getBibleVersion(versionId: string): BibleVersion | undefined {
  const versionsFile = path.join(BIBLE_PATH, "versions.json");
  const versionsRaw = readJsonFile<BibleVersionRaw[]>(versionsFile);
  
  if (!versionsRaw) return undefined;
  
  const versionRaw = versionsRaw.find(v => v.id === versionId);
  if (!versionRaw) return undefined;

  const allBooks = getBibleBooks();
  const booksMap = new Map(allBooks.map(book => [book.slug.trim(), book]));

  return {
    ...versionRaw,
    books: versionRaw.books.map(slug => booksMap.get(slug.trim())).filter((book): book is BibleBookMeta => !!book)
  };
}

export function getBibleBook(versionId: string, bookSlug: string): BibleBookContent | undefined {
  const bookFile = path.join(BIBLE_PATH, versionId, `${bookSlug}.json`);
  return readJsonFile<BibleBookContent>(bookFile) || undefined;
}

export function getBibleChapter(versionId: string, bookSlug: string, chapter: number): string[] | undefined {
  const book = getBibleBook(versionId, bookSlug);
  if (!book || !book.chapters[chapter - 1]) return undefined;
  
  return book.chapters[chapter - 1];
}
