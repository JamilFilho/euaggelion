import { NextResponse } from 'next/server';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '@/keystatic.config';
import { collections, isPublished, wiki } from '@/lib/utils';

const reader = createReader(process.cwd(), keystaticConfig);

async function getSlugsFromCollections(collectionNames: readonly string[]) {
  const slugs = new Set<string>();
  for (const collectionName of collectionNames) {
    try {
      const collection = (reader.collections as any)[collectionName];
      const items = await collection.all();
      items.forEach((item: any) => {
        const date = item.entry?.date;

        if (!date || isPublished(date)) {
          slugs.add(JSON.stringify({
            slug: item.slug,
            lastmod: date
              ? new Date(date).toISOString()
              : new Date().toISOString()
          }));
        }
      });
    } catch {
      continue;
    }
  }
  return Array.from(slugs);
}

export async function GET() {
  const baseUrl = 'https://euaggelion.com.br'; // Replace with your actual domain

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
    ...contentSlugs.map(slug => ({ url: `/content/${slug}`, lastmod: new Date().toISOString() })),
    ...authorSlugs.map(slug => ({ url: `/autores/${slug}`, lastmod: new Date().toISOString() })),
    ...wikiSlugs.map(slug => ({ url: `/wiki/${slug}`, lastmod: new Date().toISOString() })),
    ...pageSlugs.map(slug => ({ url: `/p/${slug}`, lastmod: new Date().toISOString() })),
    ...trailSlugs.map(slug => ({ url: `/trilhas/${slug}`, lastmod: new Date().toISOString() })),
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