import { collections, isPublished, wiki } from '@/lib/utils';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '@/keystatic.config';
import { Feed } from 'feed';

const reader = createReader(process.cwd(), keystaticConfig);

export const revalidate = 3600;

interface Post {
  title: string;
  description: string;
  date: string;
  slug: string;
  collection: string;
}

function parseLocalDate(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).getTime();
}

async function getAllPosts() {
  const posts: Post[] = [];

  const allCollections = [...collections, ...wiki];

  for (const collectionName of allCollections) {
    try {
      const items = await reader.collections[collectionName].all();
      for (const item of items) {
        const post = await reader.collections[collectionName].read(item.slug);
        if (post && post.date && isPublished(post.date)) {
          posts.push({
            ...(post as Omit<Post, 'collection' | 'slug'>),
            collection: collectionName,
            slug: item.slug,
          });
        }
      }
    } catch (error) {
      continue;
    }
  }

  posts.sort((a, b) => parseLocalDate(b.date) - parseLocalDate(a.date));

  return posts;
}

export async function GET() {
  const posts = await getAllPosts();

  const feed = new Feed({
    title: 'Euaggelion',
    description: 'Semeando as boas novas da salvação',
    id: 'https://euaggelion.com.br',
    link: 'https://euaggelion.com.br',
    language: 'pt-BR',
    favicon: 'https://euaggelion.com.br/favicon.ico',
    copyright: 'All rights reserved 2026, Euaggelion',
    updated: posts.length
      ? new Date(posts[0].date)
      : new Date(),
    feedLinks: {
      rss2: 'https://euaggelion.com.br/feed.xml',
    },
  });

  posts.forEach((post) => {
    let link: string;
    if (wiki.includes(post.collection as any)) {
      const category = post.collection.replace('Wiki', '').toLowerCase();
      link = `https://euaggelion.com.br/wiki/${category}/${post.slug}`;
    } else {
      link = `https://euaggelion.com.br/${post.slug}`;
    }
    feed.addItem({
      title: post.title,
      id: link,
      link: link,
      description: post.description,
      date: new Date(post.date),
    });
  });

  const rss = feed.rss2();

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}