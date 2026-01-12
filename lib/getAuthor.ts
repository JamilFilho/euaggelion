import { getAllArticles, ArticleMeta } from './getArticles';
import { AUTHORS, AuthorMeta } from './author';

export interface AuthorWithArticles extends AuthorMeta {
  articles: ArticleMeta[];
}

export function getAuthors(): AuthorWithArticles[] {
  const articles = getAllArticles();
  const authorsMap = new Map<string, ArticleMeta[]>();

  articles.forEach(article => {
    if (article.author) {
      if (!authorsMap.has(article.author)) {
        authorsMap.set(article.author, []);
      }
      authorsMap.get(article.author)!.push(article);
    }
  });

  return Object.values(AUTHORS).map(author => ({
    ...author,
    articles: authorsMap.get(author.name) || []
  }));
}