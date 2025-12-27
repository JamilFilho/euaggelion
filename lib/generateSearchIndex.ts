import fs from "fs";
import path from "path";
import { getAllArticles } from "./getArticles.js";
import { getAllWikiArticles } from "./getWiki.js";

const OUTPUT_PATH = path.join(
  process.cwd(),
  "public",
  "search-index.json"
);

export function generateSearchIndex() {
  const articles = getAllArticles().filter(article => article.published);
  const wikiArticles = getAllWikiArticles().filter(article => article.published);

  // Marca artigos da wiki para identificação
  const markedWikiArticles = wikiArticles.map(item => ({
    ...item, 
    isWiki: true
  }));

  const allContent = [...articles, ...markedWikiArticles];

  const index = allContent.map((item) => {
    const isWikiArticle = 'isWiki' in item && item.isWiki === true;
    
    const slug = isWikiArticle
      ? `/wiki/${item.category ?? 'uncategorized'}/${item.slug}`
      : `/${item.slug}`;

    return {
      slug,
      title: item.title,
      description: item.description ?? "",
      content: (item.content ?? item.description ?? "")
        .replace(/\n/g, " ")
        .replace(/\s+/g, " "),
      category: isWikiArticle 
        ? `wiki > ${item.category ?? ""}` 
        : item.category ?? "",
      date: item.date ?? new Date().toISOString(),
    };
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2));
}

generateSearchIndex();