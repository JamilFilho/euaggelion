/**
 * Related Articles Component
 * Exibe sugestões de artigos relacionados em cards
 */

import Link from "next/link";
import { ArticleMeta } from "@/lib/getArticles";
import { getRelatedArticles } from "@/lib/relatedArticles";
import { CATEGORIES } from "@/lib/categories";
import { ArrowRight } from "lucide-react";

interface RelatedArticlesProps {
  currentSlug: string;
  maxResults?: number;
  title?: string;
}

export async function RelatedArticles({
  currentSlug,
  maxResults = 3,
  title = "Leia também",
}: RelatedArticlesProps) {
  const relatedArticles = getRelatedArticles({
    currentSlug,
    maxResults,
  });

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section
      className="w-full border-t border-ring/20 py-12 px-4 md:px-20"
      aria-label="Artigos relacionados"
    >
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedArticles.map((article) => (
            <RelatedArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedArticleCard({ article }: { article: ArticleMeta }) {
  const categoryMeta = CATEGORIES[article.category] ?? {
    name: article.category,
  };
  const categoryName =
    typeof categoryMeta === "string" ? categoryMeta : categoryMeta.name;

  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Link
      href={`/${article.slug}`}
      className="group flex flex-col h-full p-5 border border-ring/20 rounded-lg hover:border-accent hover:shadow-md transition-all duration-300 hover:shadow-accent/20"
      aria-label={`Ler artigo: ${article.title}`}
    >
      {/* Categoria */}
      <span className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">
        {categoryName}
      </span>

      {/* Título */}
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
        {article.title}
      </h3>

      {/* Descrição */}
      <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">
        {article.description}
      </p>

      {/* Rodapé com Meta info */}
      <div className="flex items-center justify-between pt-4 border-t border-ring/10 mt-auto">
        <time className="text-xs text-muted-foreground">{formattedDate}</time>

        {/* Ícone CTA */}
        <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

export default RelatedArticles;
