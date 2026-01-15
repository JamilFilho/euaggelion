import fs from "fs";
import path from "path";
import { slugify } from "./utils";

const DICTIONARY_PATH = path.join(process.cwd(), "content", "wiki", "dicionario");

export interface DictionaryEntry {
  slug: string;
  title: string;
  description: string;
  letter: string;
  content: string;
  references: string[];
}

export function getAllDictionaryEntries(): DictionaryEntry[] {
  if (!fs.existsSync(DICTIONARY_PATH)) {
    return [];
  }

  const allEntries: DictionaryEntry[] = [];
  const files = fs.readdirSync(DICTIONARY_PATH, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name);

  files.forEach((file) => {
    const letter = file.charAt(0).toLowerCase(); // Assume que o arquivo é nomeado como 'a.json', etc.
    const filePath = path.join(DICTIONARY_PATH, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    // Assume que a chave é a letra maiúscula
    const entries = data[letter.toUpperCase()] || [];

    entries.forEach((entry: any) => {
      const entrySlug = slugify(entry.termo);
      allEntries.push({
        slug: `${letter}/${entrySlug}`,
        title: entry.termo,
        description: entry.definicao,
        letter,
        content: entry.definicao,
        references: entry.referencias || [],
      });
    });
  });

  return allEntries;
}

export function getDictionaryEntriesByLetter(letter: string): DictionaryEntry[] {
  return getAllDictionaryEntries().filter(entry => entry.letter === letter);
}

export function getDictionaryEntry(letter: string, entrySlug: string): DictionaryEntry | undefined {
  return getAllDictionaryEntries().find(entry => entry.letter === letter && slugify(entry.title) === entrySlug);
}

export function getDictionaryEntryByTerm(term: string): DictionaryEntry | undefined {
  return getAllDictionaryEntries().find(entry => entry.title.toLowerCase() === term.toLowerCase());
}

export function getDictionaryLetters(): string[] {
  if (!fs.existsSync(DICTIONARY_PATH)) {
    return [];
  }

  return fs.readdirSync(DICTIONARY_PATH, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name.charAt(0).toLowerCase())
    .filter((letter, index, arr) => arr.indexOf(letter) === index); // Remove duplicatas se houver
}