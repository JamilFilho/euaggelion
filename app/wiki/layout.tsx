import { Newsletter } from "@/components/layout/Newsletter";
import { WikiNavigation } from "@/components/layout/WikiNavigation";
import { Metadata } from "next";
import Link from "next/link";
import { StickyHeader } from "@/components/layout/StickyHeader";

export const metadata: Metadata = {
  title: "Wiki | Euaggelion",
  description: "Materiais de referência teológica, histórica e bíblica",
};

export default function WikiLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    return(
        <>
            <StickyHeader topOffset={0} className="px-10 py-4 flex flex-row items-center gap-2 border-b border-ring/20 bg-secondary z-[810]">
                <Link href="/wiki" title="Wiki" className="w-[10rem] md:w-[8rem] text-lg font-bold">
                    <h2>Wiki<span className="text-accent">Gelion</span></h2>
                </Link>
                <WikiNavigation.Root>
                    <WikiNavigation.Menu />
                    
                    <div className="ml-auto">
                        <WikiNavigation.Drawer />
                    </div>
                </WikiNavigation.Root>
            </StickyHeader>

            {children}
        </>
    )
}