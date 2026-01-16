import type { Metadata } from 'next';
import { getAllConcordanceEntries } from "@/lib/getConcordance";
import { Page } from "@/components/content/Page";
import { Feed } from '@/components/content/Feed';
import { CollectionPageSchema, FAQSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from 'next/link';
import { Github, X } from 'lucide-react';

const faqItems = [
    {
        question: "O que é uma concordância bíblica?",
        answer: "Uma concordância bíblica é um índice alfabético de todas as palavras significativas da Bíblia, mostrando onde cada palavra aparece e seu contexto. É uma ferramenta essencial para estudo bíblico detalhado.",
    },
    {
        question: "Quais versões da Bíblia são utilizadas?",
        answer: "Utilizamos referências da Bíblia Sagrada em português, com base em traduções reconhecidas como NVI, ACF e outras versões confiáveis.",
    },
    {
        question: "Como as palavras são selecionadas?",
        answer: "Incluímos palavras significativas da Bíblia, excluindo artigos, preposições e outras palavras muito comuns, focando em termos que têm relevância teológica ou contextual.",
    },
    {
        question: "Posso contribuir com correções ou sugestões?",
        answer: "Sim! Nossa concordância é mantida em repositório público. Acesse nosso GitHub para enviar correções, sugestões ou relatar problemas.",
        link: {
            icon: Github,
            title: "Acessar repositório",
            href: "https://github.com/JamilFilho/euaggelion"
        }
    }
];

export async function generateMetadata(): Promise<Metadata> {
  const entries = getAllConcordanceEntries();

  const categoryName = "Concordância Bíblica";
  const categoryDescription = "Explore todas as ocorrências de palavras na Bíblia Sagrada";

  const entryCount = entries.length;

  return {
    title: `${categoryName} | Bíblia | Euaggelion`,
    description: `${categoryDescription}. ${entryCount} ${entryCount === 1 ? 'palavra indexada' : 'palavras indexadas'}.`,
    keywords: [categoryName, "concordância", "bíblia", "estudo bíblico"],
    openGraph: {
      title: `${categoryName} | Bíblia | Euaggelion`,
      description: categoryDescription,
      type: 'website',
      url: `https://euaggelion.com.br/biblia/concordancia`,
      siteName: "Euaggelion",
      locale: "pt_BR",
      images: [
        {
          url: "https://euaggelion.com.br/og-image.png",
          width: 1200,
          height: 630,
          alt: categoryName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} | Bíblia | Euaggelion`,
      description: categoryDescription,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    alternates: {
      canonical: `https://euaggelion.com.br/biblia/concordancia`,
    },
  };
}

export default async function ConcordancePage() {
    const entries = getAllConcordanceEntries()
      .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
      .map(entry => ({
        ...entry,
        category: "concordancia",
        isConcordance: true,
      }));

    const categoryName = "Concordância Bíblica";
    const categoryDescription = "Explore todas as ocorrências de palavras na Bíblia Sagrada";

  return(
        <>
          {/* Schema estruturado */}
          <CollectionPageSchema
            name={categoryName}
            description={categoryDescription}
            url={`https://euaggelion.com.br/biblia/concordancia`}
            itemCount={entries.length}
          />
          <FAQSchema faqs={faqItems} />

          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Bíblia", href: "/biblia" },
              { label: categoryName, href: `/biblia/concordancia` },
            ]}
            sticky={true}
          />

            <Page.Root>
            <header className="w-full px-10 py-20 flex flex-col justify-center border-b print:border-none border-ring/20">
                <h2 className="mb-4 text-5xl text-primary font-bold">{categoryName}</h2>
                <h3 className="text-lg text-foreground/60">{categoryDescription}</h3>
            </header>
            <Page.Content>
                <Feed.Root articles={entries} category="concordancia" itemsPerPage={72}>
                <div className="border-t border-ring/20">
                    <Feed.List category="concordancia" isCategoryPage={true} />
                </div>
                <Feed.Pagination />
                </Feed.Root>
            </Page.Content>

            <section className="border-t border-ring/20" aria-labelledby="concordance-faq-title">
                <header className="px-10 py-10 border-b border-ring/20">
                    <h2 id="concordance-faq-title" className="text-2xl md:text-3xl font-semibold">Perguntas frequentes</h2>
                </header>

                <dl className="grid md:grid-cols-2">
                    {faqItems.map((faq) => (
                        <div key={faq.question} className="flex flex-col justify-center border-r border-l border-b border-ring/20 hover:bg-black/20 transition-colors ease-out">
                            <div className="p-10">
                                <dt className="text-lg font-semibold mb-2">{faq.question}</dt>
                                <dd className="text-sm md:text-base text-foreground/70 leading-relaxed">{faq.answer}</dd>
                            </div>
                            {faq.link && (
                                <Link
                                    href={faq.link.href}
                                    className="w-full flex flex-row items-center gap-4 border-t border-ring/20 mt-auto px-10 py-4"
                                >
                                    <faq.link.icon className="size-5" />
                                    {faq.link.title}
                                </Link>
                            )}
                        </div>
                    ))}
                </dl>
            </section>
        </Page.Root>
        </>
  )
}