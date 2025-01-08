export interface IOrderAttributes {
  id?: string;

  userId?: string; // ID of the user who placed the order
  totalAmount?: number; // Total amount of the order
  status?: string; // Status of the order (e.g., 'pending', 'completed', 'shipped')
  createdAt?: Date;
  updatedAt?: Date;
}
