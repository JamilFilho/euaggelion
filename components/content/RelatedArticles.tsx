import { Feed } from "@/components/content/Feed";
import { getRelatedArticles } from "@/lib/relatedArticles";

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

  const category = relatedArticles[0]?.category ?? "related";

  return (
    <Feed.Root articles={relatedArticles} category={category}>
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

export default RelatedArticles;
