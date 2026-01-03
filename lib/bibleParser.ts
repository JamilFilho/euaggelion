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
  isWholeChapterRange?: boolean; // True se é um intervalo de capítulos inteiros (ex: "1-2")
}

/**
 * Gera um mapa de nomes e abreviações para slugs de livros
 */
export async function getBookMap() {
  return BIBLE_BOOKS_MAP;
}

/**
 * Regex para capturar referências bíblicas
 * Suporta: Livro Cap:Ver, Ver; Cap:Ver-Ver (mesmo livro), cross-chapter (Cap.Ver-Cap.Ver), e capítulos inteiros (Cap-Cap)
 */
export function getBibleRegex(bookNames: string[]) {
  // Ordena por comprimento decrescente para evitar que abreviações curtas
  // capturem trechos de nomes maiores (ex: 'os' vs 'oséias').
  const sorted = [...bookNames].sort((a, b) => b.length - a.length);
  // Escapar nomes de livros para regex
  const escapedBooks = sorted.map(b => b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

  // Regex para capturar referências incluindo cross-chapter e intervalos de capítulos inteiros
  // Capítulos inteiros: 1-2, 1-5 (cap-cap sem pontos/dois-pontos)
  // Cross-chapter: 20.11-22.5 (cap.verso-cap.verso)
  // Normal: 20.11-15 (cap.verso-verso) ou 20.11,15 (cap.verso,verso)
  // Padrão: número + ":" ou "." + números/vírgulas/hífens/espaços E TAMBÉM cap.verso após hífen, OU apenas cap-cap
  const verseReference = `\\d+[:\\.][\\d,\\-–—\\.\\s]+`;
  const chapterRangeReference = `\\d+\\s*[\\-–—]\\s*\\d+`;
  // Importante: chapterReference não deve ser seguido de letra (que indicaria novo livro como "1Pe")
  const chapterReference = `\\d+(?![a-zA-Z])`;
  const reference = `(?:${verseReference}|${chapterRangeReference}|${chapterReference})`;
  // Permite múltiplas referências separadas por ; (versículos ou capítulos)
  const multipleRefs = `${reference}(?:\\s*;\\s*${reference})*`;
  return new RegExp(`\\b(${escapedBooks})\\b\\s+(${multipleRefs})`, 'gi');
}

/**
 * Detecta se um intervalo é cross-chapter de capítulos inteiros (ex: "1-2" ou "1-5")
 * e expande para incluir todos os capítulos intermediários com todos os versículos
 */
function expandChapterRange(startChapter: number, endChapter: string): BibleReference['chapters'] | null {
  // Padrão: apenas número-número (capítulos inteiros)
  // Ex: "1-2" significa capítulo 1 até capítulo 2, com todos os versículos
  const chapterRangePattern = /^(\d+)$/;
  const match = endChapter.match(chapterRangePattern);
  
  if (!match) return null;
  
  const chapterEnd = parseInt(match[1]);
  
  // Se o capítulo final é menor ou igual ao inicial, não é válido
  if (chapterEnd <= startChapter) return null;
  
  const chapters: BibleReference['chapters'] = [];
  
  // Todos os capítulos no intervalo: com todos os versículos (1 até 999 = fim do capítulo)
  for (let ch = startChapter; ch <= chapterEnd; ch++) {
    chapters.push({
      chapter: ch,
      verses: [],
      ranges: [[1, 999]]
    });
  }
  
  return chapters;
}

/**
 * Detecta se um intervalo é cross-chapter (ex: "20.11-22.5" significa cap 20 v11 até cap 22 v5)
 * e expande para incluir todos os capítulos intermediários
 */
function expandCrossChapterRange(startChapter: number, startVerse: string): BibleReference['chapters'] | null {
  // Padrão: verso_inicial-capítulo_final.verso_final
  // Ex: "11-22.5" onde 11 é verso, 22 é capítulo, 5 é verso
  const crossChapterPattern = /^(\d+)-(\d+)\.(\d+)$/;
  const match = startVerse.match(crossChapterPattern);
  
  if (!match) return null;
  
  const verseStart = parseInt(match[1]);
  const chapterEnd = parseInt(match[2]);
  const verseEnd = parseInt(match[3]);
  
  // Se o capítulo final é menor ou igual ao inicial, não é cross-chapter válido
  if (chapterEnd <= startChapter) return null;
  
  const chapters: BibleReference['chapters'] = [];
  
  // Primeiro capítulo: do verso inicial até o fim (999 representa "até o fim do capítulo")
  chapters.push({
    chapter: startChapter,
    verses: [],
    ranges: [[verseStart, 999]]
  });
  
  // Capítulos intermediários: todos os versículos
  for (let ch = startChapter + 1; ch < chapterEnd; ch++) {
    chapters.push({
      chapter: ch,
      verses: [],
      ranges: [[1, 999]]
    });
  }
  
  // Último capítulo: do início até o verso final
  chapters.push({
    chapter: chapterEnd,
    verses: [],
    ranges: [[1, verseEnd]]
  });
  
  return chapters;
}

/**
 * Faz o parsing de uma string de referência (ex: "1:1-3, 10; 14:2,4-6, 11" ou "1-2" para capítulos inteiros)
 */
export function parseReferenceDetails(refStr: string): { chapters: BibleReference['chapters']; isWholeChapterRange: boolean } {
  const chapters: BibleReference['chapters'] = [];
  const chapterParts = refStr.split(';');
  
  let lastChapter = -1;
  let isWholeChapterRange = false;
  let partCount = 0;

  chapterParts.forEach(part => {
    const trimmedPart = part.trim();
    if (!trimmedPart) return;
    partCount++;

    // Verifica se tem capítulo definido (ex: "1:1" ou "1.1") ou se é continuação (ex: "10") ou intervalo de capítulos (ex: "1-5")
    let chapterNum: number | undefined = undefined;
    let versesStr: string | undefined = undefined;

    const chapterMatch = trimmedPart.match(/^(\d+)\s*[:\.]\s*(.*)$/);
    const chapterRangeMatch = trimmedPart.match(/^(\d+)\s*[\-–—]\s*(\d+)$/); // Intervalo de capítulos inteiros
    const chapterOnlyMatch = trimmedPart.match(/^(\d+)$/);

    if (chapterMatch) {
      chapterNum = parseInt(chapterMatch[1]);
      versesStr = chapterMatch[2];
      lastChapter = chapterNum;
      // Verificar se é uma referência cross-chapter de versículos entre capítulos
      const crossChapterResult = expandCrossChapterRange(chapterNum, versesStr);
      if (crossChapterResult) {
        chapters.push(...crossChapterResult);
        return;
      }
      // Verificar se é uma referência de capítulos inteiros (ex: "1-2" sem pontos/dois-pontos)
      // Isso pode estar no versesStr (ex: capítulo "1" com versesStr "-2")
      if (versesStr && /^[\-–—]\d+$/.test(versesStr)) {
        const chapterRangeResult = expandChapterRange(chapterNum, versesStr.replace(/^[\-–—]\s*/, ''));
        if (chapterRangeResult) {
          chapters.push(...chapterRangeResult);
          lastChapter = parseInt(versesStr.replace(/^[\-–—]\s*/, ''));
          return;
        }
      }
    } else if (chapterRangeMatch) {
      // Intervalo direto de capítulos inteiros (ex: "1-2" ou "1-5")
      const startChapter = parseInt(chapterRangeMatch[1]);
      const endChapter = parseInt(chapterRangeMatch[2]);
      const chapterRangeResult = expandChapterRange(startChapter, endChapter.toString());
      if (chapterRangeResult) {
        chapters.push(...chapterRangeResult);
        lastChapter = endChapter;
        // Marcar como intervalo de capítulos inteiros apenas se houver apenas uma "parte"
        if (partCount === 1) {
          isWholeChapterRange = true;
        }
        return;
      }
    } else if (chapterOnlyMatch) {
      chapterNum = parseInt(chapterOnlyMatch[1]);
      versesStr = "";
      lastChapter = chapterNum;
    } else {
      chapterNum = lastChapter !== -1 ? lastChapter : undefined;
      versesStr = trimmedPart;
    }

    if (typeof chapterNum === "undefined" || chapterNum === -1) return;

    if (typeof versesStr === "undefined") return;

    const verses: number[] = [];
    const ranges: [number, number][] = [];

    // Se versesStr está vazio e temos um capítulo, significa capítulo inteiro
    if (versesStr === "") {
      ranges.push([1, 999]);
    } else {
      const verseParts = versesStr.split(',');
      verseParts.forEach(vPart => {
        const vTrimmed = vPart.trim();
        if (!vTrimmed) return;
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
    }

    const existingChapter = chapters.find(c => c.chapter === chapterNum);
    if (existingChapter) {
      existingChapter.verses.push(...verses);
      existingChapter.ranges.push(...ranges);
    } else {
      chapters.push({ chapter: chapterNum, verses, ranges });
    }
  });

  return { chapters, isWholeChapterRange };
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

  // Primeiro, encontrar todas as correspondências
  const matches: Array<{bookName: string; refDetails: string; bookSlug: string; fullMatch: string; index: number; endIndex: number}> = [];
  
  while ((match = regex.exec(text)) !== null) {
    const bookName = match[1].toLowerCase();
    let refDetails = match[2];
    const bookSlug = bookMap[bookName];
    const matchStart = match.index;
    const matchEnd = match.index + match[0].length;

    if (bookSlug) {
      // Verificar se há um ponto-e-vírgula seguido de texto que pode ser outro livro
      // Procurar por ; seguido de espaço e um padrão que pareça ser um livro (número + letra ou nome)
      const afterMatch = text.substring(matchEnd);
      const nextBookPattern = /^\s*;\s*([\d\w\s]+?)\s+\d+[:\.]/;
      const nextBookMatch = afterMatch.match(nextBookPattern);
      
      if (nextBookMatch) {
        // Verificar se o que vem após o ; é um nome de livro conhecido
        const potentialBook = nextBookMatch[1].toLowerCase().trim();
        if (bookMap[potentialBook]) {
          // Há um novo livro após ;, então remover tudo após o ; desta referência
          const semiColonIndex = refDetails.lastIndexOf(';');
          if (semiColonIndex !== -1) {
            const beforeSemi = refDetails.substring(0, semiColonIndex).trim();
            refDetails = beforeSemi;
          }
        }
      }

      matches.push({
        bookName,
        refDetails,
        bookSlug,
        fullMatch: match[0],
        index: matchStart,
        endIndex: matchEnd
      });
    }
  }

  // Processar matches para criar referências
  matches.forEach((m) => {
    const parsedRef = parseReferenceDetails(m.refDetails);
    references.push({
      book: m.bookName,
      bookSlug: m.bookSlug,
      chapters: parsedRef.chapters,
      fullMatch: m.fullMatch,
      isWholeChapterRange: parsedRef.isWholeChapterRange
    });
  });

  return references;
}
