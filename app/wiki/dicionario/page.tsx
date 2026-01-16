import type { Metadata } from 'next';
import { getAllDictionaryEntries } from "@/lib/getDictionary";
import { CATEGORIES } from "@/lib/categories";
import { Page } from "@/components/content/Page";
import { Feed } from '@/components/content/Feed';
import { CollectionPageSchema, FAQSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from 'next/link';
import { Github, X } from 'lucide-react';

export const revalidate = 3600; // Revalidar a cada 1 hora

const CATEGORY = "dicionario";

const faqItems = [
    {
        question: "Qual as referências utilizadas para os termos do dicionário?",
        answer: "As referências incluem a Bíblia Sagrada, dicionários teológicos reconhecidos, enciclopédias cristãs e obras de teólogos renomados ao longo da história do cristianismo. Ao final de cada definição, as principais fontes são citadas para consulta adicional.",
    },
    {
        question: "Como os termos são selecionados para inclusão no dicionário?",
        answer: "Os termos são selecionados com base em sua relevância teológica, frequência de uso em nossos artigos, estudos bíblicos e materiais, e a partir de nossos cronogramas de publicações futuras.",
    },
    {
        question: "Qual a frequência de atualização do dicionário?",
        answer: "Nosso esforço de atualização é contínuo, mantemos um cronograma de revisão e novas publicações todos os meses para garantir que o dicionário permaneça atual e relevante.",
    },
    {
        question: "Posso sugerir novos termos para o dicionário?",
        answer: "Sim! Encorajamos nossos leitores a sugerirem termos que considerem importantes. Acesse nosso repositório no GitHub para enviar sugestões ou correções.",
        link: {
            icon: Github,
            title: "Acessar repositório",
            href: "https://github.com/JamilFilho/euaggelion"
        }
    }
];

export async function generateMetadata(): Promise<Metadata> {
  const categoryMeta = CATEGORIES[CATEGORY] ?? { name: CATEGORY };
  const entries = getAllDictionaryEntries();
  
  const categoryName = typeof categoryMeta === 'string' 
    ? categoryMeta 
    : categoryMeta.name;
  
  const categoryDescription = typeof categoryMeta === 'object' && categoryMeta.description
    ? categoryMeta.description
    : `Explore verbetes sobre ${categoryName}`;

  const entryCount = entries.length;

  return {
    title: `${categoryName} | Wiki | Euaggelion`,
    description: `${categoryDescription}. ${entryCount} ${entryCount === 1 ? 'verbete disponível' : 'verbetes disponíveis'}.`,
    keywords: [categoryName, "wiki", "teologia", "cristianismo"],
    openGraph: {
      title: `${categoryName} | Wiki | Euaggelion`,
      description: categoryDescription,
      type: 'website',
      url: `https://euaggelion.com.br/wiki/${CATEGORY}`,
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
      title: `${categoryName} | Wiki | Euaggelion`,
      description: categoryDescription,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    alternates: {
      canonical: `https://euaggelion.com.br/wiki/${CATEGORY}`,
    },
  };
}

export default async function DictionaryPage() {
    const categoryMeta = CATEGORIES[CATEGORY] ?? { name: CATEGORY };
    const entries = getAllDictionaryEntries()
      .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
      .map(entry => ({
        ...entry,
        category: CATEGORY,
        isWiki: true, // Marca como wiki para o FeedLink construir a URL corretamente
      }));
    
    const categoryName = typeof categoryMeta === 'string' 
      ? categoryMeta 
      : categoryMeta.name;
    
    const categoryDescription = typeof categoryMeta === 'object' && categoryMeta.description
      ? categoryMeta.description
      : `Explore verbetes sobre ${categoryName}`;
  
  return(
        <>
          {/* Schema estruturado */}
          <CollectionPageSchema
            name={categoryName}
            description={categoryDescription}
            url={`https://euaggelion.com.br/wiki/${CATEGORY}`}
            itemCount={entries.length}
          />
          <FAQSchema faqs={faqItems} />
          
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Wiki", href: "/wiki" },
              { label: categoryName, href: `/wiki/${CATEGORY}` },
            ]}
            sticky={true}
          />
          
            <Page.Root>
            <header className="w-full px-10 py-20 flex flex-col justify-center border-b print:border-none border-ring/20">
                <h2 className="mb-4 text-5xl text-primary font-bold">{categoryMeta.name}</h2>
                <h3 className="text-lg text-foreground/60">{categoryMeta.description}</h3>
            </header>
            <Page.Content>
                <Feed.Root articles={entries} category="dicionario" itemsPerPage={72}>
                <div className="border-t border-ring/20">
                    <Feed.List category="dicionario" isCategoryPage={true} />
                </div>
                <Feed.Pagination />
                </Feed.Root>
            </Page.Content>

            <section className="border-t border-ring/20" aria-labelledby="planner-faq-title">
                <header className="px-10 py-10 border-b border-ring/20">
                    <h2 id="planner-faq-title" className="text-2xl md:text-3xl font-semibold">Perguntas frequentes</h2>
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