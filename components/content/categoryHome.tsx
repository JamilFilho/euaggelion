import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getArticlesByCategory } from "@/lib/getArticles";
import { CATEGORIES } from "@/lib/categories";
import { getReadingTime } from "@/lib/timeReader";
import { getRelativeTime } from "@/lib/relativeDate";

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

  if (!categoryMeta || articles.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col divide-y divide-ring/20 border-t border-ring/20">
        <header className="p-10">
            <h2 className="mb-2 text-3xl font-bold">{categoryMeta.name}</h2>
            <p className="text-base text-foreground/60">{categoryMeta.description}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ring/20 border-t border-ring/20">
            {articles.map((article, index) => (
            <article
              className={`h-full ${
                index === articles.length - 1 && articles.length % 3 === 1
                  ? "md:col-span-3"
                  : index === articles.length - 1 && articles.length % 3 === 2
                  ? "md:col-span-2"
                  : ""
              }`}
              key={article.slug}
            >
                <Link href={`/${article.slug}`} className="flex flex-col gap-4 h-full">
                  <header className="pt-12 px-10">
                    <h3 className="text-2xl font-bold text-foreground/90 line-clamp-2">
                      {article.title}
                    </h3>
                  </header>

                  <section className="flex-1 px-10 mb-10">
                    <p className="text-base text-foreground/60 line-clamp-3">
                      {article.description}
                    </p>
                  </section>

                  <footer className="px-10 py-4 hover:pr-8 flex flex-row justify-between items-center border-t border-ring/20 bg-black/10 hover:bg-black/20 transition-all ease-in-out text-sm text-foreground font-semibold">
                    <span>
                      Continuar lendo
                    </span>
                    <ArrowRight />
                  </footer>
                </Link>
            </article>
            ))}
        </div>
        <div className="px-10 py-6">
          <Link href={`/s/${category}`} className="w-fit text-accent flex flex-row items-center font-semibold gap-2">
              Ver tudo
              <ArrowRight className="size-4"/>
          </Link>
          </div>
    </section>
  );
}