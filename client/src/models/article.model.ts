import { ImageListType } from 'react-images-uploading';

// Re-export shared entity as the canonical article model
export type { IArticle } from '@shared/types/article.types';

// UI-only form model (used in article create/edit forms)
export interface IArticleFormModel {
  id?: string;
  title: string;
  text: string;
  photos?: ImageListType;
  images?: any;
}
