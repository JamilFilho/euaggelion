import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_PATH = path.join(process.cwd(), "content", "wiki");

export interface WikiMeta {
  slug: string;
  fileName: string;
  title: string;
  published: boolean;
  description: string;
  date: string;
  category: string;
  tags?: string[];
  content: string;
  search?: boolean;
}

export interface ArticleNavigation {
  prev: WikiMeta | null;
  next: WikiMeta | null;
}

export function getAllWikiArticles(): WikiMeta[] {
  if (!fs.existsSync(CONTENT_PATH)) {
    console.warn(`Diretório ${CONTENT_PATH} não encontrado`);
    return [];
  }

  const files = fs.readdirSync(CONTENT_PATH);
  
  return files
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => {
    const filePath = path.join(CONTENT_PATH, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
      
      return {
        slug: file.replace(/\.mdx$/, "").toLowerCase(),
        fileName: file,
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        published: data.published ?? false,
        category: (data.category ?? "").toLowerCase(),
        tags: data.tags ?? [],
        content,
        search: data.search ?? true,
      } satisfies WikiMeta;
    });
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

export function getWikiCategoriesWithCount(): { category: string; count: number }[] {
  const articles = getAllWikiArticles().filter(article => article.published);
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