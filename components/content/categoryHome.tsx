import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getArticlesByCategory } from "@/lib/getArticles";
import { CATEGORIES } from "@/lib/categories";

interface CategorySectionProps {
  category: string;
  limit?: number;
}

export function CategorySection({ 
  category, 
  limit = 3
}: CategorySectionProps) {
  const articles = getArticlesByCategory(category).slice(0, limit);
  const categoryMeta = CATEGORIES[category];

  // Se não há artigos ou categoria não existe, não renderiza nada
  if (!categoryMeta || articles.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col divide-y divide-ring/20 border-t border-ring/20">
        <header className="flex flex-row justify-between items-center py-6 px-10">
            <h2 className="text-3xl font-bold">{categoryMeta.name}</h2>
            <Link href={`/s/${category}`} className="text-accent flex flex-row items-center gap-2">
                Ver tudo
                <ArrowRight className="size-4"/>
            </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ring/20 border-t border-ring/20">
            {articles.map((article) => (
            <article className="p-10" key={article.slug}>
                <Link href={`/${article.slug}`} className="flex flex-col gap-4">
                <h3 className="text-3xl font-bold">
                    {article.title}
                </h3>

                <p className="text-foreground/60">
                    {article.description}
                </p>
                </Link>
            </article>
            ))}
        </div>
    </section>
  );
}