// Auto-generated View Model for Returns Page
export interface ReturnRequest {
  id: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  refundAmount: number;
  resolutionNote?: string;
  Order?: {
    id: string;
    orderNumber: string;
    totalPrice: number;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IReturnsPageViewModel {
    // Add properties for Returns view model
}
