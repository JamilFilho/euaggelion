import fs from "fs";
import path from "path";
import { slugify } from "./utils";

const CONCORDANCE_PATH = path.join(process.cwd(), "content", "bible", "concordance");

export interface ConcordanceEntry {
  slug: string;
  title: string;
  description: string;
  letter: string;
  content: string;
  fonte: string;
  ocorrencias: number;
  "veja tambem"?: string[];
  concordancias: {
    referencia: string;
    texto: string;
  }[];
}

export function getAllConcordanceEntries(): ConcordanceEntry[] {
  if (!fs.existsSync(CONCORDANCE_PATH)) {
    return [];
  }

  const allEntries: ConcordanceEntry[] = [];
  const files = ['a.json', 'b.json', 'c.json', 'd.json', 'e.json', 'f.json', 'g.json', 'h.json', 'i.json', 'j.json', 'l.json', 'm.json', 'n.json', 'o.json', 'p.json', 'q.json', 'r.json', 's.json', 't.json', 'y.json'];

  files.forEach((file) => {
    const letter = file.charAt(0).toLowerCase();
    const filePath = path.join(CONCORDANCE_PATH, file);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(raw);

      // A chave no JSON é a letra minúscula
      const entries = data[letter] || [];

      entries.forEach((entry: any) => {
        const entrySlug = slugify(entry.palavra);
        const description = entry.concordancias && entry.concordancias.length > 0
          ? `${entry.ocorrencias} ocorrência${entry.ocorrencias !== 1 ? 's' : ''} na Bíblia. ${entry.fonte}`
          : `Concordância bíblica para "${entry.palavra}"`;

        allEntries.push({
          slug: `${letter}/${entrySlug}`,
          title: entry.palavra,
          description,
          letter,
          content: entry.concordancias && entry.concordancias.length > 0
            ? entry.concordancias.map((ref: any) => `${ref.referencia}: ${ref.texto}`).join('\n\n')
            : `Palavra: ${entry.palavra}\nFonte: ${entry.fonte}\nOcorrências: ${entry.ocorrencias}`,
          fonte: entry.fonte,
          ocorrencias: entry.ocorrencias,
          "veja tambem": entry["veja tambem"],
          concordancias: entry.concordancias || [],
        });
      });
    }
  });

  return allEntries;
}

export function getConcordanceEntriesByLetter(letter: string): ConcordanceEntry[] {
  return getAllConcordanceEntries().filter(entry => entry.letter === letter);
}

export function getConcordanceEntry(letter: string, entrySlug: string): ConcordanceEntry | undefined {
  return getAllConcordanceEntries().find(entry => entry.letter === letter && slugify(entry.title) === entrySlug);
}

export function getConcordanceEntryByTerm(term: string): ConcordanceEntry | undefined {
  return getAllConcordanceEntries().find(entry => entry.title.toLowerCase() === term.toLowerCase());
}

export function getConcordanceLetters(): string[] {
  return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'y'];
}