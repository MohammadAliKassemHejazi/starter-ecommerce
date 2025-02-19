import React from 'react';

interface InventoryAlert {
  id: string;
  productName: string;
  quantity: number;
}

interface InventoryAlertsProps {
  alerts: InventoryAlert[];
}

const InventoryAlerts: React.FC<InventoryAlertsProps> = ({ alerts }) => {
  return (
    <div className="card mb-4">
      <div className="card-header bg-danger text-white">Inventory Alerts</div>
      <ul className="list-group list-group-flush">
        {alerts.map((alert) => (
          <li key={alert.id} className="list-group-item">
            <strong>{alert.productName}</strong> - {alert.quantity} left
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryAlerts;