export interface IStoreAttributes {
  id?: string;
  name: string;
  userId: string;
  categoryId: string;
  description?: string; // Optional description field
  image?: string; // Optional image field (URL or file path)
}