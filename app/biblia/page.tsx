import { Page } from "@/components/content/Page";
import { getBibleVersions } from "@/lib/getBible";
import Link from "next/link";

export default function BibleIndexPage() {
  const versions = getBibleVersions();

  return (
    <Page.Root>
      <Page.Header>
        <Page.Title text="Bíblia Sagrada" />
        <Page.Description text="Escolha uma tradução para começar a leitura." />
      </Page.Header>
      <Page.Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {versions.map((version) => (
            <Link key={version.id} href={`/biblia/${version.id}`} className="block p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent transition-colors">
              <h3 className="text-2xl font-semibold leading-none tracking-tight mb-2">{version.name}</h3>
              <p className="text-sm text-muted-foreground">{version.books.length} livros disponíveis</p>
            </Link>
          ))}
        </div>
      </Page.Content>
    </Page.Root>
  );
}
