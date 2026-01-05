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
  tags?: string[];
  related?: string[];
  content: string;
  search?: boolean;
}

export interface ArticleNavigation {
  prev: WikiMeta | null;
  next: WikiMeta | null;
}

function readWikiFromDirectory(dirPath: string, category: string): WikiMeta[] {
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
        status: data.status ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        published: data.published ?? false,
        category: category.toLowerCase(),
        tags: data.tags ?? [],
        related: data.related ?? [],
        content,
        search: data.search ?? true,
      } satisfies WikiMeta;
    });
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
      (article) => article.category === category.toLowerCase() && article.published
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
  const categories = articles.map(article => article.category);
  return [...new Set(categories)];
}