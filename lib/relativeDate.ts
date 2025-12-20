/**
 * Retorna uma string formatada indicando há quanto tempo uma data ocorreu
 * @param date - Data no formato "YYYY-MM-DD" ou objeto Date
 * @returns String formatada (ex: "há 2 dias", "há 3 meses", "há 1 ano")
 */
export function getRelativeTime(date: string | Date): string {
  const publishDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  // Calcula a diferença em milissegundos
  const diffInMs = now.getTime() - publishDate.getTime();
  
  // Converte para diferentes unidades
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);
  
  // Retorna a unidade mais apropriada
  if (diffInYears > 0) {
    return diffInYears === 1 ? 'há 1 ano' : `há ${diffInYears} anos`;
  }
  
  if (diffInMonths > 0) {
    return diffInMonths === 1 ? 'há 1 mês' : `há ${diffInMonths} meses`;
  }
  
  if (diffInDays > 0) {
    return diffInDays === 1 ? 'há 1 dia' : `há ${diffInDays} dias`;
  }
  
  if (diffInHours > 0) {
    return diffInHours === 1 ? 'há 1 hora' : `há ${diffInHours} horas`;
  }
  
  if (diffInMinutes > 0) {
    return diffInMinutes === 1 ? 'há 1 minuto' : `há ${diffInMinutes} minutos`;
  }
  
  return 'agora mesmo';
}

/**
 * Versão mais precisa que calcula meses considerando os dias do calendário
 */
export function getRelativeTimeAccurate(date: string | Date): string {
  const publishDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  // Calcula diferença em anos
  let years = now.getFullYear() - publishDate.getFullYear();
  let months = now.getMonth() - publishDate.getMonth();
  let days = now.getDate() - publishDate.getDate();
  
  // Ajusta se os dias forem negativos
  if (days < 0) {
    months--;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
  }
  
  // Ajusta se os meses forem negativos
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Retorna a unidade mais apropriada
  if (years > 0) {
    return years === 1 ? 'há 1 ano' : `há ${years} anos`;
  }
  
  if (months > 0) {
    return months === 1 ? 'há 1 mês' : `há ${months} meses`;
  }
  
  if (days > 0) {
    return days === 1 ? 'há 1 dia' : `há ${days} dias`;
  }
  
  const diffInMs = now.getTime() - publishDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInHours > 0) {
    return diffInHours === 1 ? 'há 1 hora' : `há ${diffInHours} horas`;
  }
  
  if (diffInMinutes > 0) {
    return diffInMinutes === 1 ? 'há 1 minuto' : `há ${diffInMinutes} minutos`;
  }
  
  return 'agora mesmo';
}