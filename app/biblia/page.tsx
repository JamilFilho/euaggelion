import { Page } from "@/components/content/Page";
import { getBibleVersion, getBibleVersions } from "@/lib/getBible";
import Link from "next/link";
import BibleVersionSelector from "@/components/content/Bible/BibleVersionSelector";

interface Props {
  searchParams: Promise<{ version?: string }>;
}

export default async function BibleIndexPage({ searchParams }: Props) {
  const { version: versionId } = await searchParams;
  const versions = getBibleVersions();
  
  // Use the selected version from URL, or default to the first version
  const selectedVersion = versionId 
    ? getBibleVersion(versionId) 
    : (versions.length > 0 ? versions[0] : null);

  return (
    <Page.Root>
      <Page.Header>
        <Page.Title content="Bíblia Sagrada" />
        <Page.Description content="Selecione um livro para começar a leitura." />
      </Page.Header>
      
      <BibleVersionSelector versions={versions} currentVersion={versionId} />
      
      <Page.Content>
        {selectedVersion ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {selectedVersion.books.map((book) => (
              <Link key={book.slug} href={`/biblia/${selectedVersion.id}/${book.slug}`} className="block p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent transition-colors text-center">
                <span className="text-sm font-medium">{book.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Nenhuma versão da Bíblia disponível.</p>
        )}
      </Page.Content>
    </Page.Root>
  );
}
