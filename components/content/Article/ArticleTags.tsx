import { Badge } from "@/components/ui/badge";

interface ArticleTagsProps {
  tags?: string[];
}

export function ArticleTags({tags}:ArticleTagsProps) {
    return(
        <ul className="md:w-2/3 mt-10 px-10 md:px-20 md:mx-auto flex flex-row flex-wrap gap-2">
          {tags?.map((tag, index) => (
            <li key={index}>
              <Badge variant="default">
                {tag}
              </Badge>
            </li>
          ))}
        </ul>
    )
}