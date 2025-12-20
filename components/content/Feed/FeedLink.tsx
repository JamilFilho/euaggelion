import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeedLinkProps {
    slug: string;
    category: string;
    articleCategory?: string;
    isWiki?: boolean;
    isCategoryPage?: boolean;
}

export default function FeedLink({ slug, category, articleCategory, isWiki = false, isCategoryPage = false }: FeedLinkProps) {
    const href = isWiki || category === "wiki"
        ? isCategoryPage
            ? `/wiki/${articleCategory}/${slug}`
            : `/wiki/${articleCategory}`
        : category === "articles"
            ? `/s/${slug}`
            : `/${slug}`;

    const content = isWiki
        ? category === "wiki"
            ? "Ver artigos"
            : "Continuar lendo"
        : category === "articles"
            ? "Ver artigos"
            : "Continuar lendo";

    return (
        <Link href={href} className="flex flex-col gap-4">
            <footer className="px-10 py-4 hover:pr-8 flex flex-row justify-between items-center border-t border-ring/20 md:border-b bg-black/10 hover:bg-black/20 transition-all ease-in-out text-sm text-foreground font-semibold">
                {content}
                <ArrowRight />
            </footer>
        </Link>
    );
}