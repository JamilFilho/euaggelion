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
 * Suporta: Livro Cap:Ver, Ver; Cap:Ver-Ver, Ver; Cap:Ver-Ver
 */
export function getBibleRegex(bookNames: string[]) {
  // Ordena por comprimento decrescente para evitar que abreviações curtas
  // capturem trechos de nomes maiores (ex: 'os' vs 'oséias').
  const sorted = [...bookNames].sort((a, b) => b.length - a.length);
  // Escapar nomes de livros para regex
  const escapedBooks = sorted.map(b => b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

  // Regex para capturar referências com múltiplos capítulos
  // Usa boundaries para garantir que não seja parte de outra palavra
  // Captura formatos como: "Mateus 5:24,27", "João 3.16-17; 4:1-5", ou apenas "Lucas 1".
  // Suporta múltiplos capítulos separados por ponto-e-vírgula
  // Pattern: Livro + 1º capítulo + (opcional: ; capítulos adicionais)
  const singleChapter = `\\d+(?:[:\\.]\\s*[\\d,\\-–—\\s]+)?`;
  const multipleChapters = `${singleChapter}(?:\\s*;\\s*${singleChapter})*`;
  return new RegExp(`\\b(${escapedBooks})\\b\\s+(${multipleChapters})`, 'gi');
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

    // Verifica se tem capítulo definido (ex: "1:1" ou "1.1") ou se é continuação (ex: "10")
    let chapterNum: number;
    let versesStr: string;

    const chapterMatch = trimmedPart.match(/^(\d+)\s*[:\.]\s*(.*)$/);
    const chapterOnlyMatch = trimmedPart.match(/^(\d+)$/);

    if (chapterMatch) {
      chapterNum = parseInt(chapterMatch[1]);
      versesStr = chapterMatch[2];
      lastChapter = chapterNum;
    } else if (chapterOnlyMatch) {
      // Apenas capítulo especificado (ex: "1") -> capítulo inteiro
      chapterNum = parseInt(chapterOnlyMatch[1]);
      versesStr = "";
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
      if (!vTrimmed) return;
      // Normalizar todos os tipos de hífens/travessões (-, –, —) para um único tipo
      const normalizedVerse = vTrimmed.replace(/[\-–—]/g, '-');
      if (normalizedVerse.includes('-')) {
        const [start, end] = normalizedVerse.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          ranges.push([start, end]);
        }
      } else {
        const vNum = parseInt(normalizedVerse);
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
