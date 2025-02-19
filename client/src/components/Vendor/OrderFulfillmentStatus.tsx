import React from 'react';

interface Order {
  id: string;
  status: string;
  date: string;
}

interface OrderFulfillmentStatusProps {
  orders: Order[];
}

const OrderFulfillmentStatus: React.FC<OrderFulfillmentStatusProps> = ({ orders }) => {
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
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.status}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderFulfillmentStatus;