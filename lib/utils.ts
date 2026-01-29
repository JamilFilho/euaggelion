import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function to merge class names conditionally

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Slugify function to create URL-friendly slugs from text

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .trim()
    .replace(/[^\w\s-]/g, '') // remove special characters
    .replace(/[\s_-]+/g, '-') // replace spaces, underscores, multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // remove leading/trailing hyphens
}

export function isPublished(date?: string): boolean {
  if (!date) return false;

  // Cria data no fuso local
  const [year, month, day] = date.split("-").map(Number);
  const publishDate = new Date(year, month - 1, day);

  const now = new Date();

  // Zera horário de "agora"
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  return publishDate.getTime() <= today.getTime();
}

export function parseLocalDate(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).getTime();
}

// Collections used in the Keystatic CMS

export const collections = [
  'blog',
  'cadaManha',
  'teoleigo',
  'sermoes',
  'ecosDaEternidade',
  'ensaiosDeUmPeregrino',
  'versoAVerso',
  'deCaDaEternidade',
  'cavaleirosDaAurora',
  'editorial',
  'bibliotecaCrista'
] as const;

export const wiki = [
  'artigosWiki',
  'bibliaWiki',
  'comentariosWiki',
  'glossarioWiki',
  'credosWiki',
  'teologosWiki'
] as const;