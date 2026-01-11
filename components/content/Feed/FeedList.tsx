"use client";


import { useFeedContext } from "./FeedProvider";
import Link from "next/link";
import { useSticky } from "@/hooks/useSticky";

interface FeedListProps {
    category: string;
    isCategoryPage?: boolean;
}

const LetterGroup = ({ letter, articles, category, isCategoryPage, trailSlug }: { letter: string, articles: any[], category: string, isCategoryPage: boolean, trailSlug?: string }) => {
    const stickyId = `sticky-glossary-${letter}`;
    const { ref } = useSticky({ id: stickyId, topOffset: -2 });
    return (
        <div>
            <div ref={ref} className="-mt-[1px] border-t bg-secondary border-b border-ring/10 px-10 py-2">
                <span className="text-xl font-bold text-accent tracking-widest">{letter}</span>
            </div>
            <div className="divide-y divide-ring/20">
                {articles.map((article) => {
                    let href = "";
                    if (article.isWiki) {
                        href = `/wiki/${article.category}/${article.slug}`;
                    } else if (trailSlug) {
                        href = `/trilhas/${trailSlug}/${article.slug}`;
                    } else if (isCategoryPage) {
                        href = `/s/${category}/${article.slug}`;
                    } else {
                        href = `/${article.slug}`;
                    }
                    return (
                        <Link
                            key={article.slug}
                            href={href}
                            className="flex w-full py-4 px-10"
                        >
                            <article className="flex flex-col gap-1">
                                <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                                    {article.title}
                                </h3>
                                {article.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {article.description}
                                    </p>
                                )}
                            </article>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default function FeedList({ category, isCategoryPage = false }: FeedListProps) {
    const { paginatedArticles, trailSlug } = useFeedContext();

    // Agrupar artigos por letra inicial do título
    const grouped = paginatedArticles.reduce<Record<string, typeof paginatedArticles>>((acc, article) => {
        const firstLetter = article.title
            ? article.title.trim().charAt(0).toUpperCase()
            : "#";
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push(article);
        return acc;
    }, {});

    // Ordenar as letras
    const sortedLetters = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'pt-BR'));

    return (
        <div className="w-full">
            {sortedLetters.map((letter) => (
                <LetterGroup key={letter} letter={letter} articles={grouped[letter]} category={category} isCategoryPage={isCategoryPage} trailSlug={trailSlug} />
            ))}
        </div>
    );
}
