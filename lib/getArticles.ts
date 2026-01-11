import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_PATH = path.join(process.cwd(), "content", "articles");

export interface ChronologyEvent {
  year: number;
  month?: string;
  day?: string;
  event: string;
  description: string;
  reference?: string[];
}

export interface ArticleMeta {
  slug: string;
  fileName: string;
  title: string;
  published: boolean;
  description: string;
  date: string;
  author?: string;
  category: string;
  categories?: string[]; // Todas as categorias do conteúdo
  tags?: string[];
  reference?: string[];
  testament?: "at" | "nt";
  chronology?: ChronologyEvent[];
  chronologyDataset?: string[];
  content: string;
  search?: boolean;
}

type ChronologyDatasetInput = string | string[] | undefined;

function normalizeChronologyDataset(value: ChronologyDatasetInput): string[] | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value : [value];
}

export interface ArticleNavigation {
  prev: ArticleMeta | null;
  next: ArticleMeta | null;
}

function readArticlesFromDirectory(dirPath: string, primaryCategory: string): ArticleMeta[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs.readdirSync(dirPath);
  
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(dirPath, file);
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

      return {
        slug: file.replace(/\.mdx$/, "").toLowerCase(),
        fileName: file,
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        author: data.author ?? "",
        published: data.published ?? false,
        category: categories[0], // primeira categoria é a principal
        categories: categories,
        tags: data.tags ?? [],
        reference: data.reference ?? [],
        testament: data.testament,
        chronology: data.chronology ?? [],
        chronologyDataset: normalizeChronologyDataset(
          data.chronologyDataset ?? data.chronology_dataset
        ),
        content,
        search: data.search ?? true,
      } satisfies ArticleMeta;
    });
}

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(CONTENT_PATH)) {
    console.warn(`Diretório ${CONTENT_PATH} não encontrado`);
    return [];
  }

  const allArticles: ArticleMeta[] = [];
  const categories = fs.readdirSync(CONTENT_PATH, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  categories.forEach((category) => {
    const categoryPath = path.join(CONTENT_PATH, category);
    const articles = readArticlesFromDirectory(categoryPath, category);
    allArticles.push(...articles);
  });

  return allArticles;
}

export function getArticlesByCategory(category?: string, limit?: number ): ArticleMeta[] {
  const allArticles = getAllArticles();
  
  let filteredArticles = allArticles.filter(article => article.published);
  
  // Filtrar apenas artigos com data igual ou anterior ao dia atual
  const today = new Date().toISOString().slice(0, 10);
  filteredArticles = filteredArticles.filter(article => article.date && article.date <= today);
  
  if (category) {
    const categoryLower = category.toLowerCase();
    filteredArticles = filteredArticles.filter(
      (article) => article.categories?.includes(categoryLower) || article.category === categoryLower
    );
  }

  const sortedArticles = filteredArticles.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  if (limit) {
    return sortedArticles.slice(0, limit);
  }
  
  return sortedArticles;
}

export function getArticleBySlug(slug: string): ArticleMeta | undefined {
  return getAllArticles().find((article) => article.slug === slug);
}

export function getArticleCategoriesWithCount(): { category: string; count: number }[] {
  const articles = getAllArticles().filter(article => article.published);
  const categoryCounts: Record<string, number> = {};

  articles.forEach((article) => {
    // Contar em todas as categorias do artigo
    const cats = article.categories || [article.category];
    cats.forEach((cat) => {
      if (categoryCounts[cat]) {
        categoryCounts[cat]++;
      } else {
        categoryCounts[cat] = 1;
      }
    });
  });

  return Object.keys(categoryCounts).map((category) => ({
    category,
    count: categoryCounts[category],
  }));
}

export function getArticleNavigation(
  currentSlug: string,
  category: string
): ArticleNavigation {
  const articlesInCategory = getArticlesByCategory(category);
  const currentIndex = articlesInCategory.findIndex(
    (article) => article.slug === currentSlug
  );

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? articlesInCategory[currentIndex - 1] : null,
    next: currentIndex < articlesInCategory.length - 1
      ? articlesInCategory[currentIndex + 1]
      : null,
  };
}