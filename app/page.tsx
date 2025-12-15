import { Page } from "@/components/content/Page";
import Image from "next/image";

export default function Home() {
  return (
      <>
      <Page.Root>
        <Page.Header>
          <Page.Title content="Euaggelion" />
          <Page.Description content="Semeando as boas novas da salvação" />
        </Page.Header>
      </Page.Root>
      </>
  );
}
