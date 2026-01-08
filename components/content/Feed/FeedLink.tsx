import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeedLinkProps {
    slug: string;
    category: string;
    articleCategory?: string;
    trailSlug?: string;
    isWiki?: boolean;
    isCategoryPage?: boolean;
}

export default function FeedLink({ slug, category, articleCategory, trailSlug, isWiki = false, isCategoryPage = false }: FeedLinkProps) {
    // Se é página de categorias wiki, o slug é a categoria
    if (category === "wiki" && !isCategoryPage) {
        return (
            <Link href={`/wiki/${slug}`} className="flex flex-col gap-4">
                <footer className="px-10 py-4 hover:pr-8 flex flex-row justify-between items-center border-t border-ring/20 md:border-b bg-black/10 hover:bg-black/20 transition-all ease-in-out text-sm text-foreground font-semibold">
                    Ver artigos
                    <ArrowRight />
                </footer>
            </Link>
        );
    }

    const href = isWiki
        ? `/wiki/${articleCategory}/${slug}`
        : isCategoryPage || category === "wiki"
            ? `/wiki/${articleCategory}`
            : category === "articles"
                ? `/s/${slug}`
                : category === "trilhas"
                ? `/trilhas/${slug}`
                : category === "steps"
                ? `/trilhas/${trailSlug}/${slug}`
                : `/${slug}`;

    const content = isWiki
        ? category === "wiki"
            ? "Continuar lendo"
            : "Continuar lendo"
        : category === "articles"
            ? "Ver artigos"
            : category === "trilhas"
            ? "Ver Trilha"
            : category === "steps"
            ? "Ver Passo"
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