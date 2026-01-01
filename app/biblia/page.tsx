import { Page } from "@/components/content/Page";
import { getBibleVersion, getBibleVersions } from "@/lib/getBible";
import Link from "next/link";
import BibleVersionSelector from "@/components/content/Bible/BibleVersionSelector";
import { Article } from "@/components/content/Article";

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
    <Article.Root>
      <Article.Header>
        <Article.Group>
          <Article.Title content="Bíblia Sagrada" />
          <Article.Description content={`"Guardei tua palavra em meu coração, para não pecar contra ti" — Salmos 119:11`}/>
        </Article.Group>
        <BibleVersionSelector versions={versions} currentVersion={versionId} />
      </Article.Header>
      
      
      <Article.Content>
        {selectedVersion ? (
          <>
          <section className="my-8">
              <header className="mb-10">
                <h4>Antigo Testamento</h4>
              </header>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedVersion.books.slice(0, 39).map((book) => (
                  <Link key={book.slug} href={`/biblia/${selectedVersion.id}/${book.slug}`}>
                    <span className="text-lg font-medium">{book.name}</span>
                  </Link>
                ))}
              </div>
          </section>
          <section className="my-8">
            <header className="mb-10">
              <h4>Novo Testamento</h4>
            </header>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedVersion.books.slice(39).map((book) => (
                <Link key={book.slug} href={`/biblia/${selectedVersion.id}/${book.slug}`}>
                  <span className="text-lg font-medium">{book.name}</span>
                </Link>
              ))}
            </div>
          </section>
        </>
        ) : (
          <p className="text-center text-muted-foreground">Nenhuma versão da Bíblia disponível.</p>
        )}
      </Article.Content>
    </Article.Root>
  );
}
