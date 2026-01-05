import { Bible } from "@/components/content/Bible";
import { Page } from "@/components/content/Page";
import { getBibleVersion } from "@/lib/getBible";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CollectionPageSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface Props {
  params: Promise<{ version: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { version: versionId } = await params;
  const version = getBibleVersion(versionId);

  if (!version) {
    return {
      title: "Versão não encontrada | Euaggelion",
      description: "A versão da Bíblia solicitada não foi encontrada.",
    };
  }

  return {
    title: `${version.name} | Bíblia | Euaggelion`,
    description: `Leia a Bíblia na versão ${version.name}. ${version.description}`,
    keywords: ["bíblia", version.name, versionId.toUpperCase(), "antigo testamento", "novo testamento"],
    openGraph: {
      type: 'website',
      title: `${version.name} | Bíblia | Euaggelion`,
      description: `Leia a Bíblia na versão ${version.name}.`,
      url: `https://euaggelion.com.br/biblia/${versionId}`,
      siteName: "Euaggelion",
      locale: "pt_BR",
      images: [
        {
          url: "https://euaggelion.com.br/og-image.png",
          width: 1200,
          height: 630,
          alt: version.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${version.name} | Bíblia | Euaggelion`,
      description: `Leia a Bíblia na versão ${version.name}.`,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    alternates: {
      canonical: `https://euaggelion.com.br/biblia/${versionId}`,
    },
  };
}

export default async function BibleVersionPage({ params }: Props) {
  const { version: versionId } = await params;
  const version = getBibleVersion(versionId);

  if (!version) {
    notFound();
  }

  return (
    <>
      {/* Schema estruturado */}
      <CollectionPageSchema
        name={version.name}
        description={version.description}
        url={`https://euaggelion.com.br/biblia/${versionId}`}
        itemCount={66}
      />
      
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Bíblia", href: "/biblia" },
          { label: version.name, href: `/biblia/${versionId}` },
        ]}
        className="container mx-auto px-4 md:px-20 py-6"
      />
      
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
    </>
  );
}
