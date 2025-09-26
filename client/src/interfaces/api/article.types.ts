import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// Article API Response Types
export interface ArticleResponse extends ApiResponse<{
  id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  UserId: string;
}> {}

export interface ArticleWithUserResponse extends ApiResponse<{
  id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  User: {
    id: string;
    name: string;
  };
}> {}

export interface ArticlesListResponse extends PaginatedApiResponse<{
  id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  User: {
    id: string;
    name: string;
  };
}> {}

export interface CreateArticleResponse extends ApiResponse<{
  id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  UserId: string;
}> {}

export interface UpdateArticleResponse extends ApiResponse<{
  id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  UserId: string;
}> {}

export interface DeleteArticleResponse extends ApiResponse<{
  message: string;
}> {}
