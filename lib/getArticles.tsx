import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_PATH = path.join(process.cwd(), "content", "articles");

export interface ArticleMeta {
  slug: string;
  fileName: string; // Nome real do arquivo
  title: string;
  published: boolean;
  description: string;
  date?: string;
  author?: string;
  category: string;
  tags?: string[];
  testament?: "at" | "nt";
}

export interface ArticleNavigation {
  prev: ArticleMeta | null;
  next: ArticleMeta | null;
}

export function getAllArticles(): ArticleMeta[] {
  // Verifica se o diretório existe
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
      const { data } = matter(raw);
      
      return {
        slug: file.replace(/\.mdx$/, "").toLowerCase(), // Slug normalizado
        fileName: file, // Nome real do arquivo
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        author: data.author ?? "",
        published: data.published ?? false,
        // Normaliza a categoria para lowercase
        category: (data.category ?? "").toLowerCase(),
        tags: data.tags ?? [],
        testament: data.testament
      } satisfies ArticleMeta;
    });
}

export function getArticlesByCategory(category?: string): ArticleMeta[] {
  const allArticles = getAllArticles();
  
  // Se não passou categoria, retorna todos os artigos publicados
  if (!category) {
    return allArticles
      .filter(article => article.published)
      .sort((a, b) => {
        // Ordena do mais novo para o mais antigo
        if (!a.date || !b.date) return 0;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }
  
  // Filtra por categoria específica e ordena
  return allArticles
    .filter(
      (article) => article.category === category.toLowerCase() && article.published
    )
    .sort((a, b) => {
      // Ordena do mais novo para o mais antigo
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export function getArticleBySlug(slug: string): ArticleMeta | undefined {
  return getAllArticles().find((article) => article.slug === slug);
}

/**
 * Obtém os artigos anterior e próximo dentro da mesma categoria
 */
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
    // Anterior = índice - 1 (mais recente na ordenação)
    prev: currentIndex > 0 ? articlesInCategory[currentIndex - 1] : null,
    // Próximo = índice + 1 (mais antigo na ordenação)
    next: currentIndex < articlesInCategory.length - 1 
      ? articlesInCategory[currentIndex + 1] 
      : null,
  };
}