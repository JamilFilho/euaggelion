import type { Metadata } from 'next';
import { getDictionaryEntriesByLetter, getDictionaryLetters } from "@/lib/getDictionary";
import { CATEGORIES } from "@/lib/categories";
import { Page } from "@/components/content/Page";
import { Feed } from '@/components/content/Feed';
import { CollectionPageSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from 'next/link';

const CATEGORY = "dicionario";

export async function generateStaticParams() {
  const letters = getDictionaryLetters();
  return letters.map((letter) => ({
    letter,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ letter: string }> }): Promise<Metadata> {
  const { letter } = await params;
  const categoryMeta = CATEGORIES[CATEGORY] ?? { name: CATEGORY };
  const entries = getDictionaryEntriesByLetter(letter);
  
  const categoryName = typeof categoryMeta === 'string' 
    ? categoryMeta 
    : categoryMeta.name;
  
  const letterName = letter.toUpperCase();
  const entryCount = entries.length;

  return {
    title: `${letterName} - ${categoryName} | Wiki | Euaggelion`,
    description: `Verbetes começando com ${letterName}. ${entryCount} ${entryCount === 1 ? 'verbete disponível' : 'verbetes disponíveis'}.`,
    keywords: [categoryName, letterName, "wiki", "teologia", "cristianismo"],
    openGraph: {
      title: `${letterName} - ${categoryName} | Wiki | Euaggelion`,
      description: `Verbetes começando com ${letterName}`,
      type: 'website',
      url: `https://euaggelion.com.br/wiki/${CATEGORY}/${letter}`,
      siteName: "Euaggelion",
      locale: "pt_BR",
      images: [
        {
          url: "https://euaggelion.com.br/og-image.png",
          width: 1200,
          height: 630,
          alt: `${letterName} - ${categoryName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${letterName} - ${categoryName} | Wiki | Euaggelion`,
      description: `Verbetes começando com ${letterName}`,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    alternates: {
      canonical: `https://euaggelion.com.br/wiki/${CATEGORY}/${letter}`,
    },
  };
}

export default async function DictionaryLetterPage({ params }: { params: Promise<{ letter: string }> }) {
    const { letter } = await params;
    const categoryMeta = CATEGORIES[CATEGORY] ?? { name: CATEGORY };
    const entries = getDictionaryEntriesByLetter(letter)
      .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
      .map(entry => ({
        ...entry,
        category: CATEGORY,
        isWiki: true,
      }));
    
    const categoryName = typeof categoryMeta === 'string' 
      ? categoryMeta 
      : categoryMeta.name;
    
    const letterName = letter.toUpperCase();
  
  return(
        <>
          <CollectionPageSchema
            name={`${letterName} - ${categoryName}`}
            description={`Verbetes começando com ${letterName}`}
            url={`https://euaggelion.com.br/wiki/${CATEGORY}/${letter}`}
            itemCount={entries.length}
          />
          
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Wiki", href: "/wiki" },
              { label: categoryName, href: `/wiki/${CATEGORY}` },
              { label: letterName, href: `/wiki/${CATEGORY}/${letter}` },
            ]}
            sticky={true}
          />
          
            <Page.Root>
            <header className="w-full px-10 py-20 flex flex-col justify-center border-b print:border-none border-ring/20">
                <h2 className="mb-4 text-5xl text-primary font-bold">{`Verbetes - ${letterName}`}</h2>
                <h3 className="text-lg text-foreground/60">Dicionário bíblico</h3>
            </header>
            <Page.Content>
                <Feed.Root articles={entries} category="wiki" itemsPerPage={72}>
                <div className="border-t border-ring/20">
                    <Feed.List category="wiki" isCategoryPage={true} />
                </div>
                <Feed.Pagination />
                </Feed.Root>
            </Page.Content>
        </Page.Root>
        </>
  )
}