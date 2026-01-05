/**
 * Related Articles Generator
 * Sugestiona artigos relacionados baseado em tags e categoria
 */

import { getAllArticles, ArticleMeta } from "./getArticles";

interface RelatedArticleOptions {
  currentSlug: string;
  maxResults?: number;
  strategy?: "tags" | "category" | "hybrid";
}

export function getRelatedArticles({
  currentSlug,
  maxResults = 5,
  strategy = "hybrid",
}: RelatedArticleOptions): ArticleMeta[] {
  const allArticles = getAllArticles().filter(
    (article) => article.published && article.slug !== currentSlug
  );

  const currentArticle = getAllArticles().find(
    (article) => article.slug === currentSlug
  );

  if (!currentArticle) {
    return [];
  }

  const scored = allArticles.map((article) => {
    let score = 0;

    // Estratégia por tags (40% do score)
    if (strategy === "tags" || strategy === "hybrid") {
      const matchingTags = currentArticle.tags?.filter((tag) =>
        article.tags?.includes(tag)
      ) || [];
      score += (matchingTags.length / (currentArticle.tags?.length || 1)) * 40;
    }

    // Estratégia por categoria (30% do score)
    if (strategy === "category" || strategy === "hybrid") {
      if (article.category === currentArticle.category) {
        score += 30;
      }
    }

    // Boost por data recente (20% do score)
    if (article.date && currentArticle.date) {
      const articleDate = new Date(article.date).getTime();
      const currentDate = new Date(currentArticle.date).getTime();
      const daysDiff = Math.abs(currentDate - articleDate) / (1000 * 60 * 60 * 24);
      const recencyScore = Math.max(0, 20 - daysDiff / 10);
      score += Math.max(0, recencyScore);
    }

    // Boost por categoria similares (10% do score)
    const categoryKeywords = currentArticle.category.split("-");
    const matchingKeywords = categoryKeywords.filter((kw) =>
      article.category.includes(kw)
    ).length;
    score += (matchingKeywords / categoryKeywords.length) * 10;

    return { article, score };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(({ article }) => article);
}

/**
 * Sugere artigos da mesma categoria
 */
export function getArticlesFromSameCategory(
  currentArticle: ArticleMeta,
  maxResults: number = 3
): ArticleMeta[] {
  return getAllArticles()
    .filter(
      (article) =>
        article.published &&
        article.category === currentArticle.category &&
        article.slug !== currentArticle.slug
    )
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, maxResults);
}

/**
 * Encontra artigos por uma tag específica
 */
export function getArticlesByTag(tag: string, maxResults: number = 5): ArticleMeta[] {
  return getAllArticles()
    .filter((article) => article.published && article.tags?.includes(tag))
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, maxResults);
}

/**
 * Análise de ligações internas - utilitário para auditoria
 */
export function analyzeLinkingStrategy(): {
  orphanArticles: ArticleMeta[];
  heavilyLinkedArticles: ArticleMeta[];
  unreachableArticles: ArticleMeta[];
  statistics: {
    totalArticles: number;
    publishedArticles: number;
    avgLinksPerArticle: number;
    totalPotentialLinks: number;
  };
} {
  const allArticles = getAllArticles();
  const publishedArticles = allArticles.filter((a) => a.published);

  const linkCountMap = new Map<string, number>();

  publishedArticles.forEach((article) => {
    const relatedCount = getRelatedArticles({
      currentSlug: article.slug,
      maxResults: 100,
    }).length;
    linkCountMap.set(article.slug, relatedCount);
  });

  const orphanArticles = publishedArticles.filter(
    (a) => (linkCountMap.get(a.slug) || 0) === 0
  );

  const heavilyLinkedArticles = publishedArticles
    .map((a) => ({
      article: a,
      count: linkCountMap.get(a.slug) || 0,
    }))
    .filter(({ count }) => count > 10)
    .map(({ article }) => article);

  const unreachableArticles = publishedArticles.filter((a) => {
    // Simula navegação a partir da home
    return (
      !getRelatedArticles({
        currentSlug: "any",
      }).includes(a)
    );
  });

  const avgLinksPerArticle =
    Array.from(linkCountMap.values()).reduce((a, b) => a + b, 0) /
    publishedArticles.length;

  return {
    orphanArticles,
    heavilyLinkedArticles,
    unreachableArticles,
    statistics: {
      totalArticles: allArticles.length,
      publishedArticles: publishedArticles.length,
      avgLinksPerArticle,
      totalPotentialLinks: publishedArticles.length * (publishedArticles.length - 1),
    },
  };
}
