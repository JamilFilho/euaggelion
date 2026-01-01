import { Page } from "@/components/content/Page";
import { getBibleVersion } from "@/lib/getBible";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ version: string }>;
}

export default async function BibleVersionPage({ params }: Props) {
  const { version: versionId } = await params;
  const version = getBibleVersion(versionId);

  if (!version) {
    notFound();
  }

  return (
    <Page.Root>
      <Page.Header>
        <Page.Title text={version.name} />
        <Page.Description text="Selecione um livro para ler." />
      </Page.Header>
      <Page.Content>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {version.books.map((book) => (
            <Link key={book.slug} href={`/biblia/${versionId}/${book.slug}/1`} className="block p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent transition-colors text-center">
              <span className="text-sm font-medium">{book.name}</span>
            </Link>
          ))}
        </div>
      </Page.Content>
    </Page.Root>
  );
}
