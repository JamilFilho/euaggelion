export function getReadingTime(
  content: string,
  wordsPerMinute: number = 200
): string {
  // Remove código MDX/JSX (componentes entre < >)
  let cleanContent = content.replace(/<[^>]*>/g, '');
  
  // Remove blocos de código (``` ... ```)
  cleanContent = cleanContent.replace(/```[\s\S]*?```/g, '');
  
  // Remove código inline (` ... `)
  cleanContent = cleanContent.replace(/`[^`]*`/g, '');
  
  // Remove links markdown [texto](url)
  cleanContent = cleanContent.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Remove imagens ![alt](url)
  cleanContent = cleanContent.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');
  
  // Remove headers (#, ##, ###, etc)
  cleanContent = cleanContent.replace(/^#+\s+/gm, '');
  
  // Remove formatação markdown (**, __, *, _)
  cleanContent = cleanContent.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1');
  
  // Remove linhas vazias extras
  cleanContent = cleanContent.replace(/\n\s*\n/g, '\n');
  
  // Conta as palavras
  const words = cleanContent
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  const wordCount = words.length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  const hours = Math.floor(minutes / 60);
  
  // Retorna horas se maior que 60 minutos
  if (hours > 0) {
    return `Leia em ${hours} hora${hours > 1 ? 's' : ''}`;
  }
  
  // Retorna formatado
  if (minutes === 1) {
    return 'Leia em 1 minuto';
  }
  
  return `Leia em ${minutes} minutos`;
}

/**
 * Retorna apenas o número de minutos
 */
export function getReadingTimeMinutes(
  content: string,
  wordsPerMinute: number = 200
): number {
  let cleanContent = content.replace(/<[^>]*>/g, '');
  cleanContent = cleanContent.replace(/```[\s\S]*?```/g, '');
  cleanContent = cleanContent.replace(/`[^`]*`/g, '');
  cleanContent = cleanContent.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  cleanContent = cleanContent.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');
  cleanContent = cleanContent.replace(/^#+\s+/gm, '');
  cleanContent = cleanContent.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1');
  cleanContent = cleanContent.replace(/\n\s*\n/g, '\n');
  
  const words = cleanContent
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  const wordCount = words.length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Retorna informações detalhadas sobre a leitura
 */
export function getReadingStats(content: string, wordsPerMinute: number = 200) {
  let cleanContent = content.replace(/<[^>]*>/g, '');
  cleanContent = cleanContent.replace(/```[\s\S]*?```/g, '');
  cleanContent = cleanContent.replace(/`[^`]*`/g, '');
  cleanContent = cleanContent.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  cleanContent = cleanContent.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');
  cleanContent = cleanContent.replace(/^#+\s+/gm, '');
  cleanContent = cleanContent.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1');
  cleanContent = cleanContent.replace(/\n\s*\n/g, '\n');
  
  const words = cleanContent
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  const wordCount = words.length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  const characters = cleanContent.length;
  
  return {
    wordCount,
    minutes,
    characters,
    formatted: minutes === 1 ? 'Leia em 1 minuto' : `Leia em ${minutes} minutos`,
  };
}