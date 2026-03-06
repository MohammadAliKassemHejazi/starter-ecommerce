// Auto-generated View Model for Shipping Page
export interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
  deliveryEstimate: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderShipping {
  id: string;
  trackingNumber: string;
  carrier: string;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED';
  Order?: {
    id: string;
    orderNumber: string;
    totalPrice: number;
  };
  ShippingMethod?: {
    id: string;
    name: string;
    cost: number;
  };
  createdAt: string;
}

export interface IShippingPageViewModel {
    // Add properties for Shipping view model
}
