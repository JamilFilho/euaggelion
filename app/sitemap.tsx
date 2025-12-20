import { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/getArticles";
import { getAllPages } from "@/lib/getPages";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const pages = getAllPages();

  const categories = [...new Set(articles.map((article) => article.category))];

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `https://euaggelion.com.br/${article.slug}`,
    lastModified: article.date,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `https://euaggelion.com.br/p/${page.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `https://euaggelion.com.br/s/${category}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://euaggelion.com.br",
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly",
      priority: 1,
    },
    ...articleEntries,
    ...pageEntries,
    ...categoryEntries,
  ];
}