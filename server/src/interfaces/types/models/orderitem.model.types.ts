export interface IOrderItemAttributes {
  id?: string;
  orderId?: string; // ID of the order associated with the item
  productId?: string; // ID of the product associated with the item
  quantity: number; // Quantity of the product in the order item
  price: number; // Price of the product at the time of order
  createdAt?: Date;
  updatedAt?: Date;
}
