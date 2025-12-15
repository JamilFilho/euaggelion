import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PAGES_PATH = path.join(process.cwd(), "content", "pages");

export interface PageMeta {
  slug: string;
  fileName: string;
  title: string;
  description?: string;
  published: boolean;
}

/**
 * Obtém todas as páginas estáticas
 */
export function getAllPages(): PageMeta[] {
  if (!fs.existsSync(PAGES_PATH)) {
    console.warn(`Diretório ${PAGES_PATH} não encontrado`);
    return [];
  }

  const files = fs.readdirSync(PAGES_PATH);
  
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(PAGES_PATH, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      
      return {
        slug: file.replace(/\.mdx$/, "").toLowerCase(),
        fileName: file,
        title: data.title ?? "",
        description: data.description ?? "",
        published: data.published ?? false,
      } satisfies PageMeta;
    });
}

/**
 * Obtém uma página específica pelo slug
 */
export function getPageBySlug(slug: string): PageMeta | undefined {
  return getAllPages().find((page) => page.slug === slug);
}

/**
 * Obtém apenas as páginas publicadas
 */
export function getPublishedPages(): PageMeta[] {
  return getAllPages().filter((page) => page.published);
}