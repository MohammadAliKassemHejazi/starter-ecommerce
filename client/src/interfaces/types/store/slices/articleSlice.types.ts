import { IArticle } from '@shared/types/article.types';

export interface ArticleState {
  articleAuthor?: IArticle[];
  article?: IArticle;
  articles?: IArticle[];
  error?: string;
}
