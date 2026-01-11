import { ArticleActions } from "./ArticleActions";
import { ArticleContent } from "./ArticleContent";
import { ArticleDescription } from "./ArticleDescription";
import { ArticleFooter } from "./ArticleFooter";
import { ArticleHeaderContent } from "./ArticleHeaderContent";
import { ArticleHeaderMeta } from "./ArticleHeaderMeta";
import { ArticleHeaderRoot } from "./ArticleHeaderRoot";
import { ArticlePublishedAt } from "./ArticlePublishedAt";
import { ArticleReadTime } from "./ArticleReadTime";
import { ArticleRoot } from "./ArticleRoot";
import { ArticleTags } from "./ArticleTags";
import { ArticleTitle } from "./ArticleTitle";
import { ArticleNavigation } from "./ArticleNavigation";
import ArticleRelated from "./ArticleRelated";


export const Article = {
    Root: ArticleRoot,
    Header: ArticleHeaderRoot,
    Group: ArticleHeaderContent,
    Meta: ArticleHeaderMeta,
    ReadTime: ArticleReadTime,
    PublishedAt: ArticlePublishedAt,
    Title: ArticleTitle,
    Description: ArticleDescription,
    Content: ArticleContent,
    Tags: ArticleTags,
    Actions: ArticleActions,
    Related: ArticleRelated,
    Navigation: ArticleNavigation,
    Footer: ArticleFooter
}