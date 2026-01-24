import { Page } from "@/components/content/Page";
import { Album, Bookmark, Sparkles } from "lucide-react";
import Link from "next/link";
import { FAQSchema, WebsiteSchema } from "@/lib/schema";
import type { Metadata } from "next";
import keystaticConfig from "@/keystatic.config";
import { createReader } from "@keystatic/core/reader";
import { collections } from "@/lib/utils";
import { Feed } from "@/components/content/Feed";

type KeystaticItem = {
  slug: string;
  entry: {
    title: string;
    description?: string;
    category: string;
    date: string;
    author?: string;
  };
};

export const metadata: Metadata = {
  alternates: {
    canonical: "https://euaggelion.com.br/",
  },
};

const reader = createReader(process.cwd(), keystaticConfig);

async function getLatestContent() {
  const allItems: Array<{
    slug: string;
    title: string;
    description: string;
    category: string;
    date: string;
    author?: string;
  }> = [];

  for (const collectionName of collections) {
    try {
      const items = await reader.collections[collectionName].all();
      items.forEach((item) => {
        if (item.slug && item.entry.date) {
          allItems.push({
            slug: item.slug,
            title: item.entry.title,
            description: item.entry.description,
            category: item.entry.category as string,
            date: item.entry.date,
            author: item.entry.author as string | undefined,
          });
        }
      });
    } catch {
      continue;
    }
  }

  allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Return the last 4 items
  return allItems.slice(0, 3);
}

async function getContent(collectionName: string) {
  const allItems: Array<{
    slug: string;
    title: string;
    description: string;
    category: string;
    date: string;
    author?: string;
  }> = [];

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = await (reader.collections as any)[collectionName].all() as KeystaticItem[];
    items.forEach((item) => {
      if (item.slug && item.entry.date) {
        allItems.push({
          slug: item.slug,
          title: item.entry.title,
          description: item.entry.description as string,
          category: item.entry.category as string,
          date: item.entry.date,
          author: item.entry.author as string | undefined,
        });
      }
    });
  } catch {
    // Handle error if needed
  }

  allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Return the last items
  return allItems.slice(0, 6);
}

export default async function Home() {
  const latestPosts = await getLatestContent();
  const latestTeoleigo = await getContent("teoleigo");
  const latestDevotionals = await getContent("cadaManha");

  const faqItems = [
        {
          question: "O Euaggelion é um ministério?",
          answer: "O projeto Euaggelion não é um ministério vinculado a nenhuma igreja ou denominação. Somos uma iniciativa independente cujo objetivo é fornecer recursos, ferramentas e conteúdos para auxiliar sua caminhada cristã.",
        },
        {
          question: "Como posso ter certeza da qualidade do conteúdo?",
          answer: "Compreendemos que a confiança é essencial, principalmente no que diz respeito a conteúdos relacionados à fé. Embora o projeto Euaggelion não seja vinculado a nenhuma instituição, nos empenhamos e preocupamos em fornecer materiais que subscrevem as confições históricas e teológicas do cristianismo evangélico.",
          link: {
            icon: Album,
            title: "Leia nossa Confissão de Fé",
            href: "/p/confissao-de-fe"
        }
        }
    ];

  return (
    <>
      <WebsiteSchema />
      <FAQSchema faqs={faqItems} />
      
      <Page.Root>
        <Page.Content>
          <Feed.Root articles={latestPosts} category="articles">
              <Feed.Header home={true}>
                <h2 className="text-lg font-bold">Últimas atualizações</h2>
              </Feed.Header>
              <Feed.Group>
                <Feed.Articles category="articles" />
              </Feed.Group>
          </Feed.Root>
          {/* Seção de Destaque - Planners */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ring/20 bg-black/20">
            <div className="h-full flex items-center justify-center py-20 md:py-0 px-10 md:px-20 col-span-1">
              <h4 className="md:text-right text-4xl font-bold">Planners Bíblicos</h4>
            </div>
            
            <div className="flex flex-col bg-secondary/40 col-span-1">
              <div className="py-20 px-10 md:px-20 flex flex-row items-center gap-6">
                <span className="p-4 rounded-lg bg-primary/10 text-primary">
                  <Bookmark className="size-6" />
                </span>
                <div>
                  <p className="text-lg text-muted-foreground">Desenvolva seu hábito de leitura bíblica</p>
                  <p className="text-xl font-semibold">Crie planos de leitura personalizados</p>
                </div>
              </div>
    
              <Link 
                className="w-full border-t border-ring/20 p-6 flex flex-row justify-center items-center bg-black/20 hover:bg-black/40 transition-colors ease-in-out"
                href="/planners"
                title="Gerar plano de leitura bíblica personalizado">
                <Sparkles className="mr-2 size-4" />
                Gerar plano
              </Link>
            </div>
          </div>

          <Feed.Root articles={latestDevotionals} category="cada-manha">
              <Feed.Header home={true}>
                <Feed.Name content="Novas de Cada Manhã" />
                <Feed.Description content="Devocionais diários para edificar sua fé" />
              </Feed.Header>
              <Feed.Group>
                <Feed.Articles category="cada-manha" />
              </Feed.Group>

              <Feed.Footer category="cada-manha"/>
          </Feed.Root>

          <Feed.Root articles={latestTeoleigo} category="teoleigo">
              <Feed.Header home={true}>
                <Feed.Name content="Teoleigo" />
                <Feed.Description content="Discussões e esnaios teológicos" />
              </Feed.Header>
              <Feed.Group>
                <Feed.Articles category="teoleigo" />
              </Feed.Group>

              <Feed.Footer category="teoleigo" />
          </Feed.Root>

          <section className="border-t border-ring/20" aria-labelledby="wiki-faq-title">
            <header className="px-10 py-10 border-b border-ring/20">
                <h2 id="wiki-faq-title" className="text-2xl md:text-3xl font-semibold">Perguntas frequentes</h2>
                <p className="text-sm md:text-base text-foreground/70 max-w-3xl">Tire suas dúvidas sobre o projeto Euaggelion</p>
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
        </Page.Content>
      </Page.Root>
    </>
  );
}