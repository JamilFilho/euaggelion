import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import { Article } from "@/components/content/Article";
import { getDictionaryEntry, getAllDictionaryEntries } from "@/lib/getDictionary";
import { CATEGORIES } from '@/lib/categories';
import { ArticleSchema, BreadcrumbSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { slugify } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import BibliaLink from '@/components/content/Bible/BibliaLink';

const CATEGORY = "dicionario";

interface DictionaryPageProps {
  params: Promise<{
    letter: string;
    entry: string;
  }>;
}

interface Params {
    letter: string;
    entry: string;
}

export async function generateStaticParams() {
  const entries = getAllDictionaryEntries();
  
  return entries.map((entry) => ({
    letter: entry.letter,
    entry: slugify(entry.title),
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<Params> 
}): Promise<Metadata> {
  const { letter, entry } = await params;
  const article = getDictionaryEntry(letter, entry);

  if (!article) {
    return {
      title: "Verbete não encontrado | Euaggelion",
      description: "O verbete solicitado não foi encontrado.",
    };
  }

  const categoryMeta = CATEGORIES[CATEGORY] ?? { name: CATEGORY };
  const categoryName = typeof categoryMeta === 'string' ? categoryMeta : categoryMeta.name;

  return {
    title: `${article.title} | Wiki | Euaggelion`,
    description: article.description,
    keywords: [article.title, categoryName, "wiki", "teologia", "cristianismo"],
    authors: [{ name: "Euaggelion", url: "https://euaggelion.com.br" }],
    category: categoryName,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      url: `https://euaggelion.com.br/wiki/${CATEGORY}/${letter}/${entry}`,
      siteName: "Euaggelion",
      locale: "pt_BR",
      images: [
        {
          url: `https://euaggelion.com.br/api/og?slug=${article.slug}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [`https://euaggelion.com.br/api/og?slug=${article.slug}`],
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    alternates: {
      canonical: `https://euaggelion.com.br/wiki/${CATEGORY}/${letter}/${entry}`,
    },
  };
}

export default async function DictionaryEntryPage({ params }: DictionaryPageProps) {
  const { letter, entry } = await params;
  const article = getDictionaryEntry(letter, entry);

  // Verificar se o verbete existe
  if (!article) {
    notFound();
  }
  
  const categoryMeta = CATEGORIES[CATEGORY] ?? { name: CATEGORY };
  const categoryName = typeof categoryMeta === 'string' ? categoryMeta : categoryMeta.name;
  
  return (
    <>
      {/* Schema estruturado de artigo */}
      <ArticleSchema
        title={article.title}
        description={article.description}
        datePublished="" // Não há data
        dateModified=""
        imageUrl={`https://euaggelion.com.br/api/og?slug=${article.slug}`}
        url={`https://euaggelion.com.br/wiki/${CATEGORY}/${letter}/${entry}`}
      />
      
      {/* Schema de breadcrumbs */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://euaggelion.com.br" },
          { name: "Wiki", url: "https://euaggelion.com.br/wiki" },
          { name: categoryName, url: `https://euaggelion.com.br/wiki/${CATEGORY}` },
          { name: letter.toUpperCase(), url: `https://euaggelion.com.br/wiki/${CATEGORY}/${letter}` },
          { name: article.title, url: `https://euaggelion.com.br/wiki/${CATEGORY}/${letter}/${entry}` },
        ]}
      />
      
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Wiki", href: "/wiki" },
          { label: categoryName, href: `/wiki/${CATEGORY}` },
          { label: letter.toUpperCase(), href: `/wiki/${CATEGORY}/${letter}` },
          { label: article.title, href: `/wiki/${CATEGORY}/${letter}/${entry}` },
        ]}
        sticky={true}
        className=""
      />
      
      <Article.Root>
      <Article.Header>
        <div className="p-10">
          <Article.Title content={article.title} variant="wiki" />
        </div>

        <Article.Meta>
          {article.references && article.references.length > 0 && (
            <>
                <div className="col-span-2 md:col-span-1 items-center border-r border-ring/20">
                    <p className="text-lg font-semibold">Referências</p>
                </div>
                <ul className="col-span-2 md:col-span-3 flex flex-row flex-wrap items-start gap-2">
                {article.references.map((ref) => (
                    <li key={ref}>
                    <BibliaLink variant="link">
                        {ref}
                    </BibliaLink>
                    </li>
                ))}
                </ul>
            </>
          )}
        </Article.Meta>
      </Article.Header>

      <div className="mb-12">
      <Article.Content>
        <p>{article.content}</p>
      </Article.Content>
      </div>
      
      <Article.Footer>
        <Article.Actions 
          headline={article.title} 
          excerpt={article.description} 
          link={`https://euaggelion.com.br/wiki/${CATEGORY}/${letter}/${entry}`}
        />
      </Article.Footer>
    </Article.Root>
    </>
  );
}