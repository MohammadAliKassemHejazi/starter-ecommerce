import { ImageListType } from "react-images-uploading";

export interface IArticleModel {
  id?: string;
  title: string;
  slug?: string;
  content: string;
  authorId?: string;
  published: boolean;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
  photos?: ImageListType;
  images?: any;
}

export interface IArticleModelWithUser extends IArticleModel {
  author?: IArticleAuthor;
}

export interface IArticleAuthor {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}
