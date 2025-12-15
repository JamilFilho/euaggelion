import { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/getArticles";
import { getAllPages } from "@/lib/getPages";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const pages = getAllPages();

  const categories = [...new Set(articles.map((article) => article.category))];

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `https://euaggelion.com/${article.slug}`,
    lastModified: article.date,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `https://euaggelion.com/p/${page.slug}`,
    lastModified: new Date().toISOString(), // Pages don't have a date, so use current date
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `https://euaggelion.com/s/${category}`,
    lastModified: new Date().toISOString(), // Categories don't have a date, so use current date
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://euaggelion.com",
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly",
      priority: 1,
    },
    ...articleEntries,
    ...pageEntries,
    ...categoryEntries,
  ];
}