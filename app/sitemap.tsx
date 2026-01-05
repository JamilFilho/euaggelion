import { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/getArticles";
import { getAllPages } from "@/lib/getPages";
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const pages = getAllPages();

  const categories = [...new Set(articles.map((article) => article.category))];
  const baseUrl = "https://euaggelion.com.br";

  const articleEntries: MetadataRoute.Sitemap = articles
    .filter(article => article.published)
    .map((article) => ({
      url: `${baseUrl}/${article.slug}`,
      lastModified: article.date ? new Date(article.date) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [
        {
          url: `${baseUrl}/api/og?slug=${article.slug}`,
          title: article.title,
          caption: article.description,
        },
      ],
    }));

  const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${baseUrl}/p/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/s/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...articleEntries,
    ...pageEntries,
    ...categoryEntries,
  ];
}