import { Badge } from "@/components/ui/badge";

interface ArticleTagsProps {
    tags?: Array<string>
}

export function ArticleTags({tags}:ArticleTagsProps) {
    return(
        <ul className="py-8 px-10 border-b border-ring/20">
          <div className="md:w-3/5 md:mx-auto flex flex-row flex-wrap gap-2">
          {tags?.map((tag, index) => (
            <li key={index}>
              <Badge variant="default">
                {tag}
              </Badge>
            </li>
          ))}
          </div>
        </ul>
    )
}