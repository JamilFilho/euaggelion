import { Metadata } from "next";
import { getBibleVersions } from "@/lib/getBible";
import { BibleVersionProvider } from "@/lib/context/BibleVersionContext";
import BibleVersionSelector from "@/components/content/Bible/BibleVersionSelector";
import BibleHomeLink from "@/components/content/Bible/BibleHomeLink";

export const metadata: Metadata = {
  title: "Bíblia | Euaggelion",
  description: "Materiais de referência teológica, histórica e bíblica",
};

export default function BibleLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    const versions = getBibleVersions();
    
    return(
        <BibleVersionProvider versions={versions}>
            <section className="mt-20 md:mt-0">
                <header className="print:hidden px-10 flex flex-row justify-between items-center gap-2 border-b border-ring/20">
                    <BibleHomeLink />
                    <BibleVersionSelector />
                </header>

                {children}
            </section>
        </BibleVersionProvider>
    )
}