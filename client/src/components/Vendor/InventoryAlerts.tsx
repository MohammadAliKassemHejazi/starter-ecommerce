import React, { useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface InventoryAlert {
  productId: string;
  productName: string;
  size?: string;
  quantity: number;
  threshold?: number;
}

interface InventoryAlertsProps {
  alerts: InventoryAlert[];
  itemsPerPage?: number;
}

const InventoryAlerts: React.FC<InventoryAlertsProps> = ({
  alerts,
  itemsPerPage = 5,
}) => {
  const alertList = Array.isArray(alerts) ? alerts : [];
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(alertList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAlerts = alertList.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {setCurrentPage(page);}
  };

  const getAlertLevel = (quantity: number, threshold?: number) => {
    if (!threshold) {return "warning";}
    if (quantity <= threshold / 2) {return "danger";}
    if (quantity < threshold) {return "warning";}
    return "success";
  };

  const getBadgeClass = (level: string) => {
    switch (level) {
      case "danger":
        return "bg-danger";
      case "warning":
        return "bg-warning text-dark";
      default:
        return "bg-success";
    }
  };

  // ✅ No alerts
  if (alertList.length === 0) {
    return (
      <div className="card mb-4 text-center shadow-sm">
        <div className="card-header bg-success text-white d-flex align-items-center justify-content-center">
          <CheckCircle className="me-2" size={20} />
          <span>Inventory Status</span>
        </div>
        <div className="card-body text-muted">
          <p className="mb-0">All products are sufficiently stocked. 🎉</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-danger text-white d-flex align-items-center">
        <AlertTriangle className="me-2" size={20} />
        <span>Low Stock Alerts</span>
      </div>

      <ul className="list-group list-group-flush">
        {currentAlerts.map((alert, index) => {
          const level = getAlertLevel(alert.quantity, alert.threshold);
          const badgeClass = getBadgeClass(level);

          return (
            <li
              key={`${alert.productId}-${index}`}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{alert.productName}</strong>
                {alert.size && (
                  <span className="text-muted ms-2">({alert.size})</span>
                )}
                {alert.threshold && (
                  <small className="d-block text-muted">
                    Threshold: {alert.threshold}
                  </small>
                )}
              </div>
              <span className={`badge rounded-pill ${badgeClass}`}>
                {alert.quantity} left
              </span>
            </li>
          );
        })}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="card-footer d-flex justify-content-center align-items-center">
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }).map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default InventoryAlerts;
