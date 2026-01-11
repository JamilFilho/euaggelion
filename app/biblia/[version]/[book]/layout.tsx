import Link from "next/link";
import { notFound } from "next/navigation";
import { getBibleVersion } from "@/lib/getBible";

interface Props {
  children: React.ReactNode;
  params: Promise<{
    version: string;
    book: string;
  }>;
}

export default async function BibleBookLayout({ children, params }: Props) {
  const { version: versionId, book: bookSlug } = await params;
  const version = getBibleVersion(versionId);

  if (!version) {
    notFound();
  }

  const oldTestament = version.books.filter((book) => book.testament === "AT");
  const newTestament = version.books.filter((book) => book.testament === "NT");

  return (
    <>
      {children}

      <aside className="p-10 print:hidden border-t border-ring/20 bg-secondary/80">
        <div className="grid gap-8">
          <section className="grid gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.08em] text-foreground/60">Antigo Testamento</span>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-3">
              {oldTestament.map((book) => (
                <li key={book.slug}>
                  <Link
                    href={`/biblia/${versionId}/${book.slug}`}
                    title={book.name}
                    aria-current={book.slug === bookSlug ? "page" : undefined}
                    className="text-accent underline decoration-dotted underline-offset-4"
                  >
                    {book.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.08em] text-foreground/60">Novo Testamento</span>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-3">
              {newTestament.map((book) => (
                <li key={book.slug}>
                  <Link
                    href={`/biblia/${versionId}/${book.slug}`}
                    title={book.name}
                    aria-current={book.slug === bookSlug ? "page" : undefined}
                    className="text-accent underline decoration-dotted underline-offset-4"
                  >
                    {book.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </>
  );
}
