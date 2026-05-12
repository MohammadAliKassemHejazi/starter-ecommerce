import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// Article entity shape
export interface IArticle {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: {
    id: string;
    name: string;
  };
}

// Article API Response Types
export interface ArticleResponse extends ApiResponse<IArticle> {}

export interface ArticlesListResponse extends PaginatedApiResponse<IArticle> {}

export interface CreateArticleResponse extends ApiResponse<{
  id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}> {}

export interface UpdateArticleResponse extends ApiResponse<{
  id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}> {}

export interface DeleteArticleResponse extends ApiResponse<{
  message: string;
}> {}
