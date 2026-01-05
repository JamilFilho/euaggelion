import { Feed } from "@/components/content/Feed";
import { Page } from "@/components/content/Page";
import { Newsletter } from "@/components/layout/Newsletter";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";
import { getArticlesByCategory } from "@/lib/getArticles";
import { getAllWikiCategory } from "@/lib/getWiki";
import { Bookmark, BookMarked, Sparkles } from "lucide-react";
import Link from "next/link";
import { WebsiteSchema } from "@/lib/schema";

export default async function Home() {
  const firstFeed = [
    {
      category: "teoleigo",
      limit: 6
    },
    {
      category: "biblioteca-crista",
      limit: 3
    }
  ]

  const lastFeed = [
    {
      category: "cada-manha",
      limit: 6
    },
    {
      category: "verso-a-verso",
      limit: 3
    }
  ]

  return (
    <>
      {/* Schema estruturado para homepage */}
      <WebsiteSchema />
      
      <Page.Root>
        <Page.Header variant="home">
          <Page.Title content="Euaggelion" />
          <Page.Description content="Semeando as boas novas da salvação" />
        </Page.Header>

        <Page.Content>
          {firstFeed.map((feedItem) => {
            const articles = getArticlesByCategory(feedItem.category, feedItem.limit);
            const categoryMeta = CATEGORIES[feedItem.category];
            
            return (
              <Feed.Root key={feedItem.category} articles={articles} category={feedItem.category}>
                <Feed.Header show={false} home>
                  <Feed.Name content={categoryMeta.name} />
                  <Feed.Description content={categoryMeta.description} />
                </Feed.Header>
                <Feed.Group>
                  <Feed.Articles category={feedItem.category} />
                  <Feed.Footer category={feedItem.category} />
                </Feed.Group>
                <Feed.Pagination />
              </Feed.Root>
            );
          })}

          <div className="border-t border-ring/20 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ring/20 bg-black/20">
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

          {lastFeed.map((feedItem) => {
            const articles = getArticlesByCategory(feedItem.category, feedItem.limit);
            const categoryMeta = CATEGORIES[feedItem.category];
            
            return (
              <Feed.Root key={feedItem.category} articles={articles} category={feedItem.category}>
                <Feed.Header show={false} home>
                  <Feed.Name content={categoryMeta.name} />
                  <Feed.Description content={categoryMeta.description} />
                </Feed.Header>
                <Feed.Group>
                  <Feed.Articles category={feedItem.category} />
                  <Feed.Footer category={feedItem.category} />
                </Feed.Group>
                <Feed.Pagination />
              </Feed.Root>
            );
          })}

          <Newsletter.Root>
            <Newsletter.Header>
              <Newsletter.Title content="NewsGelion"/>
              <Newsletter.Headline content="Receba nossos materiais, gratuitamente, em seu e-mail." />
            </Newsletter.Header>
            <Newsletter.Form />
            <Newsletter.Footer />
          </Newsletter.Root>

        </Page.Content>
      </Page.Root>
    </>
  );
}