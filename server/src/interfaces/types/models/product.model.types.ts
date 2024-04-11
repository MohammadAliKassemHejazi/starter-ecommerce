export interface IProductAttributes {
  id?: string;
  name: string;
  description: string;
  price: number;
  stockQuantity?: number;
  ownerId?:string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
