import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bíblia | Euaggelion",
  description: "Materiais de referência teológica, histórica e bíblica",
};

export default function BibleLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    return(
        <section className="mt-20 md:mt-0">
            <header className="print:hidden px-10 py-4 flex flex-row items-center gap-2 border-b border-ring/20">
                <Link href="/biblia" title="Wiki" className="text-lg font-bold">
                    <h2>Bíblia Sagrada</h2>
                </Link>
            </header>

            {children}
        </section>
    )
}