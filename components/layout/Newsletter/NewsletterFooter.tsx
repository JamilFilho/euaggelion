import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NewsletterFooter() {
    return(
        <div className="px-10 pt-10 text-sm text-foreground/60">
            <span> Ao se inscrever em nossa newsletter você concorda com <Link href="/p/privacidade" title="Política de Privacidade" className="underline decoration-dashed text-accent">nossa política de privacidade</Link>
            </span>
        </div>
    )
}