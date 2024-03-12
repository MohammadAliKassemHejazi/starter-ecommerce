export interface IProductAttributes {
  id?: string;
  name: string;
  description: string;
  price: number;
  stockQuantity?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
