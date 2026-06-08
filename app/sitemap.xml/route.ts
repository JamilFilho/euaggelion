import { NextResponse } from 'next/server';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '@/keystatic.config';
import { collections, isPublished, wiki } from '@/lib/utils';

const reader = createReader(process.cwd(), keystaticConfig);

async function getSlugsFromCollections(collectionNames: readonly string[]) {
  const seen = new Set<string>();
  const results: { slug: string; lastmod: string }[] = [];

  for (const collectionName of collectionNames) {
    try {
      const collection = (reader.collections as any)[collectionName];
      const items = await collection.all();
      items.forEach((item: any) => {
        const date = item.entry?.date;

        if (!date || isPublished(date)) {
          if (!seen.has(item.slug)) {
            seen.add(item.slug);
            results.push({
              slug: item.slug,
              lastmod: date
                ? new Date(date).toISOString()
                : new Date().toISOString(),
            });
          }
        }
      });
    } catch {
      continue;
    }
  }
  return results;
}

export async function GET() {
  const baseUrl = 'https://euaggelion.com.br';

  const contentSlugs = await getSlugsFromCollections(collections);
  const authorSlugs = await getSlugsFromCollections(['authors']);
  const wikiSlugs = await getSlugsFromCollections(wiki);
  const pageSlugs = await getSlugsFromCollections(['page']);
  const trailSlugs = await getSlugsFromCollections(['trails']);

  const urls = [
    { url: '/', lastmod: new Date().toISOString() },
    { url: '/autores', lastmod: new Date().toISOString() },
    { url: '/biblia', lastmod: new Date().toISOString() },
    { url: '/planners', lastmod: new Date().toISOString() },
    { url: '/search', lastmod: new Date().toISOString() },
    { url: '/trilhas', lastmod: new Date().toISOString() },
    { url: '/wiki', lastmod: new Date().toISOString() },
    ...contentSlugs.map(({ slug, lastmod }) => ({ url: `/content/${slug}`, lastmod })),
    ...authorSlugs.map(({ slug, lastmod }) => ({ url: `/autores/${slug}`, lastmod })),
    ...wikiSlugs.map(({ slug, lastmod }) => ({ url: `/wiki/${slug}`, lastmod })),
    ...pageSlugs.map(({ slug, lastmod }) => ({ url: `/p/${slug}`, lastmod })),
    ...trailSlugs.map(({ slug, lastmod }) => ({ url: `/trilhas/${slug}`, lastmod })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, lastmod }) => `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}