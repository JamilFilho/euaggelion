import { getBibleVersion, getBibleVersions } from "@/lib/getBible";
import Link from "next/link";
import { Bible } from "@/components/content/Bible";

interface Props {
  searchParams: Promise<{ version?: string }>;
}

export default async function BibleIndexPage({ searchParams }: Props) {
  const { version: versionId } = await searchParams;
  
  // Use the selected version from URL, or default to NVT
  // Note: The client-side context will handle persistence, but for SSR we use the query param
  const selectedVersion = versionId 
    ? getBibleVersion(versionId) 
    : getBibleVersion("nvt");

  return (
    <Bible.Root>
      <Bible.Header>
        <Bible.Group>
          <Bible.Title content="Bíblia Sagrada" />
          <Bible.Description content={`"Guardei tua palavra em meu coração, para não pecar contra ti" — Salmos 119:11`}/>
        </Bible.Group>
      </Bible.Header>
      
      
      <Bible.Feed>
        {selectedVersion ? (
          <>
          <Bible.Books>
            <Bible.BooksHeader>
              <Bible.BooksTitle content="Antigo Testamento" />
            </Bible.BooksHeader>

            <Bible.BooksItems version={selectedVersion} testament="at" currentVersionId={selectedVersion.id}/>
          </Bible.Books>

          <Bible.Books>
            <Bible.BooksHeader>
              <Bible.BooksTitle content="Novo Testamento" />
            </Bible.BooksHeader>

            <Bible.BooksItems version={selectedVersion} testament="nt" currentVersionId={selectedVersion.id}/>
          </Bible.Books>
          </>
        ) : (
          <p className="text-center text-muted-foreground">Nenhuma versão da Bíblia disponível.</p>
        )}
      </Bible.Feed>
    </Bible.Root>
  );
}
