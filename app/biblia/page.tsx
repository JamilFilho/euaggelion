import { getBibleVersion, getBibleVersions } from "@/lib/getBible";
import Link from "next/link";
import { Bible } from "@/components/content/Bible";
import { CollectionPageSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bíblia Online | Euaggelion",
  description: "Leia a Bíblia Sagrada online em português com diferentes versões disponíveis. Acesse o Antigo e Novo Testamento gratuitamente.",
  keywords: ["bíblia", "bíblia online", "sagrada escritura", "antigo testamento", "novo testamento", "nvt", "nvi", "acf"],
  openGraph: {
    title: "Bíblia Online | Euaggelion",
    description: "Leia a Bíblia Sagrada online em português com diferentes versões disponíveis.",
    type: "website",
    url: "https://euaggelion.com.br/biblia",
    siteName: "Euaggelion",
    locale: "pt_BR",
    images: [
      {
        url: "https://euaggelion.com.br/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bíblia Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bíblia Online | Euaggelion",
    description: "Leia a Bíblia Sagrada online em português.",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
  },
  alternates: {
    canonical: "https://euaggelion.com.br/biblia",
  },
};

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
    <>
      {/* Schema estruturado */}
      <CollectionPageSchema
        name="Bíblia Online"
        description="Leia a Bíblia Sagrada online com diferentes versões disponíveis"
        url="https://euaggelion.com.br/biblia"
        itemCount={66}
      />
      
      <Breadcrumb
        className="sticky top-14 !z-[600] bg-secondary"
        items={[
          { label: "Home", href: "/" },
          { label: "Bíblia", href: "/biblia" },
        ]}
      />
      
      <Bible.Root>
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
    </>
  );
}
