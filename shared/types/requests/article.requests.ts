// Article Request Body Types

export interface CreateArticleRequest {
  title: string;
  text: string;
}

export interface UpdateArticleRequest {
  title?: string;
  text?: string;
}
