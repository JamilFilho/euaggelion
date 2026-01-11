import { Feed } from "feed";
import { getAllArticles } from "@/lib/getArticles";
import { getTrails, getTrailSteps } from "@/lib/getTrails";
import { CATEGORIES } from "@/lib/categories";
export const dynamic = "force-static";

export async function GET() {
  const siteURL = "https://euaggelion.com.br";

  const feed = new Feed({
    title: "Euaggelion",
    description: "Semeando as boas novas da salvação. Artigos, estudos bíblicos, devocionais e meditações sobre as temáticas da fé cristã.",
    id: siteURL,
    link: siteURL,
    language: "pt-BR",
    image: `${siteURL}/euaggelion-logo.svg`,
    favicon: `${siteURL}/favicon.ico`,
    copyright: `CC0 1.0 Universal - Domínio Público`,
    updated: new Date(),
    generator: "Euaggelion RSS Feed",
    feedLinks: {
      rss2: `${siteURL}/feed`,
      atom: `${siteURL}/feed`,
    },
    author: {
      name: "Euaggelion",
      link: siteURL,
    },
  });

  const articles = getAllArticles()
    .filter(article => article.published && article.date)
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 50); // Últimos 50 artigos

  articles.forEach((article) => {
    const categoryMeta = CATEGORIES[article.category];
    const categoryName = typeof categoryMeta === 'string' 
      ? categoryMeta 
      : categoryMeta?.name || article.category;

    feed.addItem({
      title: article.title,
      id: `${siteURL}/${article.slug}`,
      link: `${siteURL}/${article.slug}`,
      description: article.description,
      content: article.content || article.description,
      author: [
        {
          name: article.author || "Euaggelion",
          link: siteURL,
        },
      ],
      date: new Date(article.date!),
      category: [
        {
          name: categoryName,
          domain: `${siteURL}/s/${article.category}`,
        },
      ],
      image: `${siteURL}/api/og?slug=${article.slug}`,
      published: new Date(article.date!),
    });
  });

  // Adicionar trilhas ao feed
  const trails = await getTrails();
  trails
    .filter(trail => trail.date)
    .forEach((trail) => {
      feed.addItem({
        title: trail.title,
        id: `${siteURL}/trilhas/${trail.slug}`,
        link: `${siteURL}/trilhas/${trail.slug}`,
        description: trail.description,
        content: trail.description,
        author: [
          {
            name: trail.author || "Euaggelion",
            link: siteURL,
          },
        ],
        date: new Date(trail.date!),
        category: [
          {
            name: "Trilhas",
            domain: `${siteURL}/trilhas`,
          },
        ],
        published: new Date(trail.date!),
      });
    });

  // Adicionar steps das trilhas ao feed
  for (const trail of trails) {
    const steps = await getTrailSteps(trail.slug);
    steps
      .filter(step => step.date)
      .forEach((step) => {
        feed.addItem({
          title: `${trail.title} - ${step.title}`,
          id: `${siteURL}/trilhas/${trail.slug}/${step.slug}`,
          link: `${siteURL}/trilhas/${trail.slug}/${step.slug}`,
          description: step.description,
          content: step.description,
          author: [
            {
              name: step.author || trail.author || "Euaggelion",
              link: siteURL,
            },
          ],
          date: new Date(step.date!),
          category: [
            {
              name: `Trilhas - ${trail.title}`,
              domain: `${siteURL}/trilhas/${trail.slug}`,
            },
          ],
          published: new Date(step.date!),
        });
      });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
