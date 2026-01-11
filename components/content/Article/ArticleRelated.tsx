import { Feed } from "@/components/content/Feed";
import { getRelatedArticles, getRelatedContent } from "@/lib/relatedArticles";
import { getWikiSlug } from "@/lib/getWiki";
import { getArticleBySlug } from "@/lib/getArticles";

interface ArticleRelatedProps {
  currentSlug: string;
  maxResults?: number;
  title?: string;
  includeWiki?: boolean;
}

export default async function ArticleRelated({
  currentSlug,
  maxResults = 3,
  title = "Leia também",
  includeWiki = false,
}: ArticleRelatedProps) {
  let related;
  let category;

  if (includeWiki) {
    // Buscar em artigos e wiki
    const relatedContent = getRelatedContent({
      currentSlug,
      maxResults,
    });

    if (relatedContent.length === 0) {
      return null;
    }

    // Normalizar para o formato esperado pelo Feed
    related = relatedContent.map((item) => {
      const isWiki = 'status' in item;
      return {
        slug: item.slug,
        title: item.title,
        description: item.description,
        category: item.category,
        author: 'author' in item ? item.author : undefined,
        date: item.date,
        isWiki: isWiki, // Flag para indicar que é wiki
      };
    });

    category = related[0]?.category ?? "related";
  } else {
    // Comportamento original: apenas artigos
    const relatedArticles = getRelatedArticles({
      currentSlug,
      maxResults,
    });

    if (relatedArticles.length === 0) {
      return null;
    }

    related = relatedArticles;
    category = relatedArticles[0]?.category ?? "related";
  }

  return (
    <Feed.Root articles={related} category={category}>
      <Feed.Header show={false} home>
        <Feed.Name content={title} />
        <Feed.Description content="Sugestões de leitura para você se aprofundar no estudo da palavra" />
      </Feed.Header>

      <Feed.Group>
        <Feed.Articles category={category} />
      </Feed.Group>
    </Feed.Root>
  );
}