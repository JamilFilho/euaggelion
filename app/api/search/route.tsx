import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/getArticles";
export const dynamic = "force-static";

/**
 * API Route que retorna o índice de busca
 * Esta rota é cacheada automaticamente pelo Next.js
 */
export async function GET() {
  const articles = getAllArticles()
    .filter(article => article.published)
    .map(article => ({
      slug: article.slug,
      fileName: article.fileName,
      title: article.title,
      description: article.description,
      date: article.date,
      author: article.author,
      published: article.published,
      category: article.category,
      tags: article.tags,
      testament: article.testament,
    }));

  return NextResponse.json(articles, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}