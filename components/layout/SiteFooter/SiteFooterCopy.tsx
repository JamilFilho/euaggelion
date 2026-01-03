import { ArrowRight, Facebook, Globe, Instagram, Rss } from "lucide-react";
import Link from "next/link";
import { InstallButton } from "@/components/layout/PWA/pwaPrompt";

interface SiteFooterCopyProps {
    copyright: string;
    content: string;
}

export function SiteFooterCopy({copyright, content}: SiteFooterCopyProps) {
    return(
        <>
            <div className="col-span-1 md:col-span-2 mb-10 md:mb-0 flex flex-col gap-4">
                <a className="w-fit" href="https://web.archive.org/web/*/https://euaggelion.com.br" title="Internet Archive Snapshot" target="_blanck">
                    <img src="https://img.shields.io/badge/dynamic/json?url=https://archive.org/wayback/available?url=euaggelion.com.br&label=Wayback%20Machine&query=$.archived_snapshots.closest.timestamp&color=blue&logo=internetarchive" alt="Internet Archive Snapshot" />
                </a>
                <span className="font-bold">{copyright}</span>
                <p className="text-foreground/60">{content}</p>
                <p><Link href="/p/sobre" className="w-fit flex flex-row items-center gap-2 text-accent underline decoration-dashed" title="Sobre Nós">Saiba mais <ArrowRight className="size-4" /></Link></p>
            </div>

            <InstallButton />
        </>
    )
}