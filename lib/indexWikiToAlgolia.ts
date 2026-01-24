import algoliasearch from 'algoliasearch';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import 'dotenv/config';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'YOUR_APP_ID';
const adminKey = process.env.ALGOLIA_ADMIN_KEY || 'YOUR_ADMIN_KEY';
const indexName = 'wiki';

const client = algoliasearch(appId, adminKey);
const index = client.initIndex(indexName);

interface WikiItem {
  objectID: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  date: string;
  related?: string[];
}

function getAllMdocFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllMdocFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.mdoc')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function parseMdocFile(filePath: string): WikiItem | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);
    const data = parsed.data as any;
    const body = parsed.content;

    // Truncate content to stay under Algolia's 10KB limit
    const truncatedBody = body.length > 4000 ? body.substring(0, 4000) + '...' : body;

    // Gerar slug baseado no caminho
    const relativePath = path.relative('content/wiki', filePath);
    const slug = relativePath.replace(/\.mdoc$/, '').replace(/\\/g, '/');

    return {
      objectID: slug,
      slug,
      title: data.title || '',
      description: data.description || '',
      content: truncatedBody,
      category: 'wiki',
      date: data.date || '',
      related: data.related || [],
    };
  } catch (error) {
    console.error(`Erro ao parsear ${filePath}:`, error);
    return null;
  }
}

async function indexWiki() {
  const wikiDir = path.join(process.cwd(), 'content', 'wiki');
  const files = getAllMdocFiles(wikiDir);

  const records: WikiItem[] = [];

  for (const file of files) {
    const record = parseMdocFile(file);
    if (record) {
      records.push(record);
    }
  }

  try {
    await index.saveObjects(records);
    console.log(`Indexado ${records.length} itens na wiki.`);
  } catch (error) {
    console.error('Erro ao indexar:', error);
  }
}

indexWiki();