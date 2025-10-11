import React from 'react';

interface Order {
  orderId: string;
  paymentStatus: string;
  shippingStatus: string;
  date?: string;
}

interface OrderFulfillmentStatusProps {
  orders: Order[];
}

const OrderFulfillmentStatus: React.FC<OrderFulfillmentStatusProps> = ({ orders }) => {

  const orderList = Array.isArray(orders) ? orders : [];

  if (orderList.length === 0) {
    return (
      <div className="card mb-4">
        <div className="card-header bg-info text-white">Order Fulfillment Status</div>
        <div className="card-body">
          <p className="mb-0">No orders found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-header bg-info text-white">Order Fulfillment Status</div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
{orderList.map((order, index) => (
  <tr key={`${order.orderId}-${index}`}>
    <td>{order.orderId}</td>
    <td>{order.paymentStatus} / {order.shippingStatus}</td>
    <td>{order.date ? new Date(order.date).toLocaleDateString() : '—'}</td>
  </tr>
))}


        </tbody>
      </table>
    </div>
  );
};
export default OrderFulfillmentStatus;