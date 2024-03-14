import { Request } from "express";
import { IArticleAttributes } from "../models/article.model.types";

export interface ArticleCreateBodyRequest extends Request {
  body: {
    title?: string | undefined;
    text?: string | undefined;
    type?: string | undefined;
    userId?: string | undefined;
  };
}

export interface ArticleUpdateBodyRequest extends Request {
  params: { id: string };
  body: {
    id?: string;
    title?: string | undefined;
    text?: string | undefined;
    type?: string | undefined;
  };
}

export interface ArticleGetRequest extends Request {
  query: { id: string };
}

export interface ArticleDeleteRequest extends Request {
  params: { id: string };
}

export interface IArticlesBodyResponse {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  UserId: string;
  User?: IArticleAuthor;
}

export interface IArticleAuthor {
  id: string;
  name: string;
  surname: string;
}
