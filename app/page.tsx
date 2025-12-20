import { Page } from "@/components/content/Page";
import { CategorySection } from "@/components/content/categoryHome";
import { Newsletter } from "@/components/layout/Newsletter";

export default function Home() {
  return (
    <>
      <Page.Root>
        <Page.Header variant="home">
          <Page.Title content="Euaggelion" />
          <Page.Description content="Semeando as boas novas da salvação" />
        </Page.Header>

        <Page.Content>
          <CategorySection category="ecos-da-eternidade" limit={3} />

          <Newsletter.Root>
            <Newsletter.Header>
              <Newsletter.Title content="NewsGelion"/>
              <Newsletter.Headline content="Receba nossos materiais, gratuitamente, em seu e-mail." />
            </Newsletter.Header>
            <Newsletter.Form />
            <Newsletter.Footer />
          </Newsletter.Root>

          <CategorySection category="teoleigo" limit={3} />
        </Page.Content>
      </Page.Root>
    </>
  );
}