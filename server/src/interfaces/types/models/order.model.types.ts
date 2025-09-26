export interface IOrderAttributes {
  id?: string;
  currency?: string;
  userId?: string; // ID of the user who placed the order
  tenantId?: string; // RLS tenant isolation
  totalAmount?: number; // Total amount of the order
  status?: string; // Status of the order (e.g., 'pending', 'completed', 'shipped')
  createdAt?: Date;
  updatedAt?: Date;
}
