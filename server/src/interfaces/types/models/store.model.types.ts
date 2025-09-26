export interface IStoreAttributes {
  id?: string;
  name: string;
  userId?: string;
  categoryId?: string;
  description: string;
  imgUrl: string;
  tenantId?: string; // RLS tenant isolation
}