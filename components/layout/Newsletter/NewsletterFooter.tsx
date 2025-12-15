import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NewsletterFooter() {
    return(
        <div className="px-10 pt-10 text-sm text-foreground/60">
            <span>
            Não compartilhamos seus dados com terceiros. <Link href="/p/privacidade" title="Política de Privacidade" className="flex flex-row items-center gap-2 underline decoration-dashed text-accent">Leia nossa política de privacidade <ArrowRight className="size-4" /></Link>
            </span>
        </div>
    )
}