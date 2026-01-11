import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_PATH = path.join(process.cwd(), "content", "wiki");

export interface WikiMeta {
  slug: string;
  fileName: string;
  title: string;
  status: string;
  published: boolean;
  description: string;
  date: string;
  category: string;
  categories?: string[]; // Todas as categorias do conteúdo
  tags?: string[];
  related?: string[];
  content: string;
  search?: boolean;
}

export interface ArticleNavigation {
  prev: WikiMeta | null;
  next: WikiMeta | null;
}

function readWikiFromDirectory(
  dirPath: string, 
  primaryCategory: string, 
  relativePath: string = ""
): WikiMeta[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const allArticles: WikiMeta[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  // Processar arquivos .mdx no diretório atual
  const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"));
  
  files.forEach((file) => {
    const filePath = path.join(dirPath, file.name);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    
    // Normalizar categorias: pode ser string ou array
    let categories: string[] = [];
    if (data.category) {
      categories = Array.isArray(data.category)
        ? (data.category as string[]).map(c => String(c).toLowerCase())
        : [String(data.category).toLowerCase()];
    }
    if (categories.length === 0) {
      categories = [primaryCategory.toLowerCase()];
    }

    // Construir slug incluindo o caminho relativo (ex: "joao-calvino/genesis")
    const fileSlug = file.name.replace(/\.mdx$/, "").toLowerCase();
    const fullSlug = relativePath 
      ? `${relativePath}/${fileSlug}` 
      : fileSlug;

    allArticles.push({
      slug: fullSlug,
      fileName: file.name,
      title: data.title ?? "",
      status: data.status ?? "",
      description: data.description ?? "",
      date: data.date ?? "",
      published: data.published ?? false,
      category: categories[0], // primeira categoria é a principal
      categories: categories,
      tags: data.tags ?? [],
      related: data.related ?? [],
      content,
      search: data.search ?? true,
    } satisfies WikiMeta);
  });

  // Processar subdiretórios recursivamente
  const directories = entries.filter((entry) => entry.isDirectory());
  
  directories.forEach((dir) => {
    const subDirPath = path.join(dirPath, dir.name);
    const newRelativePath = relativePath 
      ? `${relativePath}/${dir.name}` 
      : dir.name;
    
    const subArticles = readWikiFromDirectory(subDirPath, primaryCategory, newRelativePath);
    allArticles.push(...subArticles);
  });

  return allArticles;
}

export function getAllWikiArticles(): WikiMeta[] {
  if (!fs.existsSync(CONTENT_PATH)) {
    return [];
  }

  const allArticles: WikiMeta[] = [];
  const categories = fs.readdirSync(CONTENT_PATH, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  categories.forEach((category) => {
    const categoryPath = path.join(CONTENT_PATH, category);
    const articles = readWikiFromDirectory(categoryPath, category);
    allArticles.push(...articles);
  });

  return allArticles;
}

export function getAllWikiCategory(category?: string): WikiMeta[] {
  const allArticles = getAllWikiArticles();
  
  if (!category) {
    return allArticles
      .filter(article => article.published)
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }
  
  return allArticles
    .filter(
      (article) => {
        const categoryLower = category.toLowerCase();
        // Buscar por todas as categorias do artigo
        return (article.categories?.includes(categoryLower) || article.category === categoryLower)
          && article.published;
      }
    )
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export function getWikiSlug(slug: string): WikiMeta | undefined {
  return getAllWikiArticles().find((article) => article.slug === slug);
}

export function getWikiCategories(): string[] {
  const articles = getAllWikiArticles();
  const categories = articles.flatMap(article => article.categories || [article.category]);
  return [...new Set(categories)];
}

// Buscar artigos de um subgrupo específico (ex: "joao-calvino" dentro de "comentarios")
export function getWikiSubgroup(category: string, subgroupPath: string): WikiMeta[] {
  const allArticles = getAllWikiArticles();
  
  return allArticles
    .filter((article) => {
      const categoryMatches = article.category === category.toLowerCase();
      const slugStartsWithSubgroup = article.slug.startsWith(`${subgroupPath}/`);
      return categoryMatches && slugStartsWithSubgroup && article.published;
    })
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

// Listar todos os subgrupos de uma categoria
export function getWikiSubgroups(category: string): string[] {
  const categoryPath = path.join(CONTENT_PATH, category);
  
  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const allArticles = getAllWikiArticles().filter(
    (article) => article.category === category.toLowerCase()
  );

  // Extrair subgrupos únicos dos slugs (primeira parte antes da barra)
  const subgroups = new Set<string>();
  
  allArticles.forEach((article) => {
    const parts = article.slug.split('/');
    if (parts.length > 1) {
      subgroups.add(parts[0]);
    }
  });

  return Array.from(subgroups);
}