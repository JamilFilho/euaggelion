import { BIBLE_BOOKS_MAP } from "./bibleData";

export interface BibleReference {
  book: string;
  bookSlug: string;
  chapters: {
    chapter: number;
    verses: number[]; // Versículos individuais ou início/fim de intervalos
    ranges: [number, number][]; // Intervalos [início, fim]
  }[];
  fullMatch: string;
}

/**
 * Gera um mapa de nomes e abreviações para slugs de livros
 */
export async function getBookMap() {
  return BIBLE_BOOKS_MAP;
}

/**
 * Regex para capturar referências bíblicas
 * Suporta: Livro Cap:Ver, Ver; Cap:Ver-Ver, Ver
 */
export function getBibleRegex(bookNames: string[]) {
  // Escapar nomes de livros para regex
  const escapedBooks = bookNames.map(b => b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  
  // Regex para capturar: (Livro) (Capítulo):(Versículos e Capítulos subsequentes)
  // Ex: Mateus 2:1; João 3:16-17, 18; 4:1
  return new RegExp(`(${escapedBooks})\\s+(\\d+:\\d+[^a-zA-Z]*)`, 'gi');
}

/**
 * Faz o parsing de uma string de referência (ex: "1:1-3, 10; 14:2,4-6, 11")
 */
export function parseReferenceDetails(refStr: string) {
  const chapters: BibleReference['chapters'] = [];
  const chapterParts = refStr.split(';');
  
  let lastChapter = -1;

  chapterParts.forEach(part => {
    const trimmedPart = part.trim();
    if (!trimmedPart) return;

    // Verifica se tem capítulo definido (ex: "1:1-3") ou se é continuação (ex: "10")
    const hasChapter = trimmedPart.includes(':');
    let chapterNum: number;
    let versesStr: string;

    if (hasChapter) {
      const [c, v] = trimmedPart.split(':');
      chapterNum = parseInt(c);
      versesStr = v;
      lastChapter = chapterNum;
    } else {
      chapterNum = lastChapter;
      versesStr = trimmedPart;
    }

    if (chapterNum === -1) return;

    const verses: number[] = [];
    const ranges: [number, number][] = [];

    const verseParts = versesStr.split(',');
    verseParts.forEach(vPart => {
      const vTrimmed = vPart.trim();
      if (vTrimmed.includes('-')) {
        const [start, end] = vTrimmed.split('-').map(n => parseInt(n));
        if (!isNaN(start) && !isNaN(end)) {
          ranges.push([start, end]);
        }
      } else {
        const vNum = parseInt(vTrimmed);
        if (!isNaN(vNum)) {
          verses.push(vNum);
        }
      }
    });

    // Agrupar por capítulo se já existir
    const existingChapter = chapters.find(c => c.chapter === chapterNum);
    if (existingChapter) {
      existingChapter.verses.push(...verses);
      existingChapter.ranges.push(...ranges);
    } else {
      chapters.push({ chapter: chapterNum, verses, ranges });
    }
  });

  return chapters;
}

/**
 * Função principal para encontrar referências em um texto
 */
export async function findBibleReferences(text: string): Promise<BibleReference[]> {
  const bookMap = await getBookMap();
  const bookNames = Object.keys(bookMap);
  const regex = getBibleRegex(bookNames);
  
  const references: BibleReference[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const bookName = match[1].toLowerCase();
    const refDetails = match[2];
    const bookSlug = bookMap[bookName];

    if (bookSlug) {
      references.push({
        book: match[1],
        bookSlug,
        chapters: parseReferenceDetails(refDetails),
        fullMatch: match[0]
      });
    }
  }

  return references;
}
