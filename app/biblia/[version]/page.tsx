import { Bible } from "@/components/content/Bible";
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
    <Bible.Root>
      <Bible.Header>
        <Bible.Group>
          <Bible.Title content={version.name} />
          <Bible.Description content={version.description} />
        </Bible.Group>
      </Bible.Header>

      <Bible.Feed>
          <Bible.Books>
            <Bible.BooksHeader>
              <Bible.BooksTitle content="Antigo Testamento" />
            </Bible.BooksHeader>

            <Bible.BooksItems version={version} testament="at"/>
          </Bible.Books>

          <Bible.Books>
            <Bible.BooksHeader>
              <Bible.BooksTitle content="Novo Testamento" />
            </Bible.BooksHeader>

            <Bible.BooksItems version={version} testament="nt"/>
          </Bible.Books>
      </Bible.Feed>
    </Bible.Root>
  );
}
