interface SiteFooterCopyProps {
    copyright: string;
    content: string;
}

export function SiteFooterCopy({copyright, content}: SiteFooterCopyProps) {
    return(
        <section className="px-10 col-span-2 text-base mt-8 pt-8 border-t border-ring/20">
            <div className="md:w-3/5">
                <span className="font-bold">{copyright}</span>
                <p className="text-foreground/60">{content}</p>
            </div>
          </section>
    )
}