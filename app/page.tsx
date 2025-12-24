import { Feed } from "@/components/content/Feed";
import { Page } from "@/components/content/Page";
import { Newsletter } from "@/components/layout/Newsletter";
import { CATEGORIES } from "@/lib/categories";
import { getArticlesByCategory } from "@/lib/getArticles";
import { getAllWikiCategory } from "@/lib/getWiki";

export default async function Home() {
  const homeFeed = [
    {
      category: "verso-a-verso",
      limit: 6
    },
    {
      category: "teoleigo",
      limit: 3
    }
  ]

  const getWiki = getAllWikiCategory().map(article => ({...article}));

  return (
    <>
      <Page.Root>
        <Page.Header variant="home">
          <Page.Title content="Euaggelion" />
          <Page.Description content="Semeando as boas novas da salvação" />
        </Page.Header>

        <Page.Content>
          {homeFeed.map((feedItem) => {
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

          <Feed.Root articles={getWiki} category="wiki">
            <Feed.Header show={false} home>
              <Feed.Name content="WikiGelion" />
              <Feed.Description content="Últimas atualizações da wiki" />
            </Feed.Header>
            <Feed.Group>
              <Feed.Articles category="wiki" />
            </Feed.Group>
            <Feed.Pagination />
          </Feed.Root>

        </Page.Content>
      </Page.Root>
    </>
  );
}