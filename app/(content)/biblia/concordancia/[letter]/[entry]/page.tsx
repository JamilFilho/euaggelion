import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import { Article } from "@/components/content/Article";
import { getConcordanceEntry } from "@/lib/getConcordance";
import { ArticleSchema, BreadcrumbSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import BibliaLink from '@/components/content/Bible/BibliaLink';

type ConcordancePageProps = {
  params: Promise<{
    letter: string;
    entry: string;
  }>;
};

export const revalidate = 3600; // Revalidar a cada 1 hora

export async function generateMetadata({
  params
}: {
  params: Promise<{ letter: string; entry: string; }>
}): Promise<Metadata> {
  const { letter, entry } = await params;
  // Ensure letter and entry are strings and not undefined
  if (typeof letter !== 'string' || typeof entry !== 'string') {
    return {
      title: "Palavra não encontrada | Euaggelion",
      description: "A palavra solicitada não foi encontrada na concordância.",
    };
  }
  const article = getConcordanceEntry(letter, entry);

  if (!article) {
    return {
      title: "Palavra não encontrada | Euaggelion",
      description: "A palavra solicitada não foi encontrada na concordância.",
    };
  }

  const categoryName = "Concordância Bíblica";

  return {
    title: `${article.title} | Bíblia | Euaggelion`,
    description: article.description,
    keywords: [article.title, categoryName, "concordância", "bíblia", "estudo bíblico"],
    authors: [{ name: "Euaggelion", url: "https://euaggelion.com.br" }],
    category: categoryName,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      url: `https://euaggelion.com.br/biblia/concordancia/${letter}/${entry}`,
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
      canonical: `https://euaggelion.com.br/biblia/concordancia/${letter}/${entry}`,
    },
  };
}

export default async function ConcordanceEntryPage({ params }: ConcordancePageProps) {
  const { letter, entry } = await params;
  // Ensure letter and entry are strings and not undefined
  if (typeof letter !== 'string' || typeof entry !== 'string') {
    notFound();
  }
  const article = getConcordanceEntry(letter, entry);

  // Verificar se a palavra existe
  if (!article) {
    notFound();
  }

  const categoryName = "Concordância Bíblica";

  return (
    <>
      {/* Schema estruturado de artigo */}
      <ArticleSchema
        title={article.title}
        description={article.description}
        datePublished="" // Não há data
        dateModified=""
        imageUrl={`https://euaggelion.com.br/api/og?slug=${article.slug}`}
        url={`https://euaggelion.com.br/biblia/concordancia/${entry}`}
      />

      {/* Schema de breadcrumbs */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://euaggelion.com.br" },
          { name: "Bíblia", url: "https://euaggelion.com.br/biblia" },
          { name: categoryName, url: `https://euaggelion.com.br/biblia/concordancia` },
          { name: letter.toUpperCase(), url: `https://euaggelion.com.br/biblia/concordancia/${letter}` },
          { name: article.title, url: `https://euaggelion.com.br/biblia/concordancia/${letter}/${entry}` },
        ]}
      />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Bíblia", href: "/biblia" },
          { label: categoryName, href: `/biblia/concordancia` },
          { label: letter.toUpperCase(), href: `/biblia/concordancia/${letter}` },
          { label: article.title, href: `/biblia/concordancia/${letter}/${entry}` },
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
          <div className="col-span-2 md:col-span-1 items-center border-r border-ring/20">
              <p className="text-lg font-semibold">Fonte</p>
          </div>
          <div className="col-span-2 md:col-span-3">
              <p className="text-sm">{article.fonte}</p>
          </div>
          <div className="col-span-2 md:col-span-1 items-center border-r border-t border-ring/20">
              <p className="text-lg font-semibold">Ocorrências</p>
          </div>
          <div className="col-span-2 md:col-span-3 border-t border-ring/20">
              <p className="text-sm">{article.ocorrencias}</p>
          </div>
          {article["veja tambem"] && article["veja tambem"].length > 0 && (
            <>
                <div className="col-span-2 md:col-span-1 items-center border-r border-t border-ring/20">
                    <p className="text-lg font-semibold">Veja também</p>
                </div>
                <div className="col-span-2 md:col-span-3 border-t border-ring/20">
                    <p className="text-sm">{article["veja tambem"].join(", ")}</p>
                </div>
            </>
          )}
        </Article.Meta>
      </Article.Header>

      <div className="mb-12">
      <Article.Content>
        <div className="space-y-4">
          {article.concordancias.map((ref, idx) => (
            <div key={idx} className="border-l-4 border-accent pl-4 py-2">
              <BibliaLink>
                {ref.referencia}
              </BibliaLink>
              <p className="text-foreground/80 italic">{ref.texto}</p>
            </div>
          ))}
        </div>
      </Article.Content>
      </div>

      <Article.Footer>
        <Article.Actions
          headline={article.title}
          excerpt={article.description}
          link={`https://euaggelion.com.br/biblia/concordancia/${letter}/${entry}`}
        />
      </Article.Footer>
    </Article.Root>
    </>
  );
}