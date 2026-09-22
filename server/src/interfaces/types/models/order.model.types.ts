export interface IOrderAttributes {
  id?: string;
  orderNumber?: string; // Unique, human-readable order number (e.g. ORD-20260922-a1b2c3d4)
  currency?: string;
  userId?: string; // ID of the user who placed the order
  paymentId?: string;
  // NOT a stored column: Order has no total-price column by design (see
  // data-architect decision, TASK-13) -- OrderItem.price * quantity is the
  // source of truth and would silently drift if duplicated here. Computed
  // on demand via services/order.service.ts#computeOrderTotal(orderItems).
  totalAmount?: number;
  status?: string; // Status of the order (e.g., 'pending', 'completed', 'shipped')
  createdAt?: Date;
  updatedAt?: Date;
}
