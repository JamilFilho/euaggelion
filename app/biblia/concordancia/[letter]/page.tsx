import type { Metadata } from 'next';
import { getConcordanceEntriesByLetter, getConcordanceLetters } from "@/lib/getConcordance";
import { Page } from "@/components/content/Page";
import { Feed } from '@/components/content/Feed';
import { CollectionPageSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export async function generateStaticParams() {
  const letters = getConcordanceLetters();
  return letters.map((letter) => ({
    letter,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ letter: string }> }): Promise<Metadata> {
  const { letter } = await params;
  const entries = getConcordanceEntriesByLetter(letter);

  const categoryName = "Concordância Bíblica";
  const letterName = letter.toUpperCase();
  const entryCount = entries.length;

  return {
    title: `${letterName} - ${categoryName} | Bíblia | Euaggelion`,
    description: `Palavras começando com ${letterName}. ${entryCount} ${entryCount === 1 ? 'palavra indexada' : 'palavras indexadas'}.`,
    keywords: [categoryName, letterName, "concordância", "bíblia", "estudo bíblico"],
    openGraph: {
      title: `${letterName} - ${categoryName} | Bíblia | Euaggelion`,
      description: `Palavras começando com ${letterName}`,
      type: 'website',
      url: `https://euaggelion.com.br/biblia/concordancia/${letter}`,
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
      title: `${letterName} - ${categoryName} | Bíblia | Euaggelion`,
      description: `Palavras começando com ${letterName}`,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    alternates: {
      canonical: `https://euaggelion.com.br/biblia/concordancia/${letter}`,
    },
  };
}

export default async function ConcordanceLetterPage({ params }: { params: Promise<{ letter: string }> }) {
    const { letter } = await params;
    const entries = getConcordanceEntriesByLetter(letter)
      .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
      .map(entry => ({
        ...entry,
        category: "concordancia",
        isConcordance: true,
      }));

    const categoryName = "Concordância Bíblica";
    const letterName = letter.toUpperCase();

  return(
        <>
          <CollectionPageSchema
            name={`${letterName} - ${categoryName}`}
            description={`Palavras começando com ${letterName}`}
            url={`https://euaggelion.com.br/biblia/concordancia/${letter}`}
            itemCount={entries.length}
          />

          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Bíblia", href: "/biblia" },
              { label: categoryName, href: `/biblia/concordancia` },
              { label: letterName, href: `/biblia/concordancia/${letter}` },
            ]}
            sticky={true}
          />

            <Page.Root>
            <header className="w-full px-10 py-20 flex flex-col justify-center border-b print:border-none border-ring/20">
                <h2 className="mb-4 text-5xl text-primary font-bold">{`Palavras - ${letterName}`}</h2>
                <h3 className="text-lg text-foreground/60">Concordância bíblica</h3>
            </header>
            <Page.Content>
                <Feed.Root articles={entries} category="concordancia" itemsPerPage={72}>
                <div className="border-t border-ring/20">
                    <Feed.List category="concordancia" isCategoryPage={true} />
                </div>
                <Feed.Pagination />
                </Feed.Root>
            </Page.Content>
        </Page.Root>
        </>
  )
}