import { Feed } from "feed";
import { getAllArticles } from "@/lib/getArticles";

export async function GET() {
  const siteURL = "https://euaggelion.com";

  const feed = new Feed({
    title: "Euaggelion",
    description: "Semeando as boas novas da salvação",
    id: siteURL,
    link: siteURL,
    language: "pt-BR",
    image: `${siteURL}/favicon.ico`,
    favicon: `${siteURL}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} Euaggelion`,
    updated: new Date(),
    feedLinks: {
      rss2: `${siteURL}/feed`,
    },
    author: {
      name: "Euaggelion",
      link: siteURL,
    },
  });

  const articles = getAllArticles().filter(article => article.published);

  articles.forEach((article) => {
    feed.addItem({
      title: article.title,
      id: `${siteURL}/${article.slug}`,
      link: `${siteURL}/${article.slug}`,
      description: article.description,
      content: article.description,
      author: [
        {
          name: article.author || "Euaggelion",
          link: siteURL,
        },
      ],
      date: article.date ? new Date(article.date) : new Date(),
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
