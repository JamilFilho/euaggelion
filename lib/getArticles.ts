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
  tags?: string[];
  reference?: string[];
  testament?: "at" | "nt";
  chronology?: ChronologyEvent[];
  chronologyDataset?: string;
  content: string;
  search?: boolean;
}

export interface ArticleNavigation {
  prev: ArticleMeta | null;
  next: ArticleMeta | null;
}

function readArticlesFromDirectory(dirPath: string, category: string): ArticleMeta[] {
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
      
      return {
        slug: file.replace(/\.mdx$/, "").toLowerCase(),
        fileName: file,
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        author: data.author ?? "",
        published: data.published ?? false,
        category: category.toLowerCase(),
        tags: data.tags ?? [],
        reference: data.reference ?? [],
        testament: data.testament,
        chronology: data.chronology ?? [],
        chronologyDataset: data.chronologyDataset ?? data.chronology_dataset,
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
  
  if (category) {
    filteredArticles = filteredArticles.filter(
      (article) => article.category === category.toLowerCase()
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
    const category = article.category;
    if (categoryCounts[category]) {
      categoryCounts[category]++;
    } else {
      categoryCounts[category] = 1;
    }
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