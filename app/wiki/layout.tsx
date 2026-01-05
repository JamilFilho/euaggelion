import { Newsletter } from "@/components/layout/Newsletter";
import { WikiNavigation } from "@/components/layout/WikiNavigation";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wiki | Euaggelion",
  description: "Materiais de referência teológica, histórica e bíblica",
};

export default function WikiLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    return(
        <section>
            <header className="sticky top-0 print:hidden px-10 py-4 flex flex-row items-center gap-2 border-b border-ring/20 bg-secondary z-[900]">
                <Link href="/wiki" title="Wiki" className="w-[10rem] md:w-[8rem] text-lg font-bold">
                    <h2>Wiki<span className="text-accent">Gelion</span></h2>
                </Link>
                <WikiNavigation.Root>
                    <WikiNavigation.Menu />
                    
                    <div className="ml-auto">
                        <WikiNavigation.Drawer />
                    </div>
                </WikiNavigation.Root>
            </header>

            {children}

            <Newsletter.Root>
                <Newsletter.Header>
                    <Newsletter.Title content="NewsGelion"/>
                    <Newsletter.Headline content="Gostou deste conteúdo? Inscreva-se gratuitamente e receba materiais como este em seu e-mail." />
                </Newsletter.Header>
                <Newsletter.Form />
                <Newsletter.Footer />
            </Newsletter.Root>
        </section>
    )
}