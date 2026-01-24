import { collections } from '@/lib/utils';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { Feed } from 'feed';

const reader = createReader(process.cwd(), keystaticConfig);

interface Post {
  title: string;
  description: string;
  date: string;
  slug: string;
  collection: string;
}

async function getAllPosts() {
  const posts: Post[] = [];

  for (const collectionName of collections) {
    try {
      const items = await reader.collections[collectionName].all();
      for (const item of items) {
        const post = await reader.collections[collectionName].read(item.slug);
        if (post && post.date) {
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

  // Ordenar por data decrescente
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
    updated: new Date(),
    feedLinks: {
      rss2: 'https://euaggelion.com.br/feed.xml',
    },
  });

  posts.forEach((post) => {
    const link = `https://euaggelion.com.br/${post.slug}`;
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