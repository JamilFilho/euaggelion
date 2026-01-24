import keystaticConfig from "@/keystatic.config";
import { createReader } from "@keystatic/core/reader";
import { slugify, wiki} from "@/lib/utils";
import { Page } from "@/components/content/Page";
import { Feed } from "@/components/content/Feed";
import { Github } from "lucide-react";
import Link from "next/link";

const reader = createReader(process.cwd(), keystaticConfig);

type GlossaryItem = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date?: Date;
  tags?: string[];
  isWiki?: boolean;
};

async function getGlossaryItems(categorySlug: string) {
  const publications = [];

  for (const collectionName of wiki) {
    try {
      const items = await reader.collections[collectionName].all();
      const filteredItems = items.filter((item) => {
        const itemCategorySlug = slugify(item.entry.category || '');
        return itemCategorySlug === categorySlug;
      });
      const mappedItems = filteredItems.map(item => ({
        slug: item.slug,
        title: item.entry.title,
        description: '',
        category: slugify(item.entry.category || ''),
        date: item.entry.date ? new Date(item.entry.date) : undefined,
        tags: 'tags' in item.entry ? (item.entry.tags?.filter((tag): tag is string => tag !== null) ?? undefined) : undefined,
      }));
      publications.push(...mappedItems);
    } catch (error) {
      continue;
    }
  }
  return publications;
}

const faqItems = [
    {
        question: "Qual as referências utilizadas para os termos do glossário?",
        answer: "As referências incluem a Bíblia Sagrada, dicionários teológicos reconhecidos, enciclopédias cristãs e obras de teólogos renomados ao longo da história do cristianismo. Ao final de cada definição, as principais fontes são citadas para consulta adicional.",
    },
    {
        question: "Como os termos são selecionados para inclusão no glossário?",
        answer: "Os termos são selecionados com base em sua relevância teológica, frequência de uso em nossos artigos, estudos bíblicos e materiais, e a partir de nossos cronogramas de publicações futuras.",
    },
    {
        question: "Qual a frequência de atualização do glossário?",
        answer: "Nosso esforço de atualização é contínuo, mantemos um cronograma de revisão e novas publicações todos os meses para garantir que o glossário permaneça atual e relevante.",
    },
    {
        question: "Posso sugerir novos termos para o glossário?",
        answer: "Sim! Encorajamos nossos leitores a sugerirem termos que considerem importantes. Acesse nosso repositório no GitHub para enviar sugestões ou correções.",
        link: {
            icon: Github,
            title: "Acessar repositório",
            href: "https://github.com/JamilFilho/euaggelion"
        }
    }
];

export default async function GlossaryPage() {
    const category = "glossario";
    const categoryData = await reader.collections.categories.read(category);
    const articlesInCategory = (await getGlossaryItems(category))
        .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
        .map((article) => ({
        ...article,
        date: article.date ? article.date.toISOString() : undefined,
        isWiki: true, // Marca como wiki para o FeedLink construir a URL corretamente
    }));

    return(
        <Page.Root>
            <Page.Header>
                <Page.Title content={categoryData?.name ?? ''} />
                {categoryData?.description && (
                <Page.Description content={categoryData.description} />
                )}
            </Page.Header>
            <Page.Content>
                <Feed.Root articles={articlesInCategory} category="wiki" itemsPerPage={72}>
                <div className="border-t border-ring/20">
                    <Feed.List category="wiki" isCategoryPage={true} />
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
    )
}