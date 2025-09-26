import React from 'react';

interface TableEmptyProps {
  colSpan: number;
  message?: string;
  icon?: string;
  className?: string;
  action?: React.ReactNode;
}

export const TableEmpty: React.FC<TableEmptyProps> = ({
  colSpan,
  message = 'No data found',
  icon = 'bi-inbox',
  className = '',
  action
}) => {
  return (
    <tr>
      <td colSpan={colSpan} className={`text-center py-5 ${className}`}>
        <div className="d-flex flex-column align-items-center">
          <div className="empty-icon mb-3">
            <i className={`${icon} text-muted`} style={{ fontSize: '3rem' }}></i>
          </div>
          <div className="empty-message text-muted mb-3">
            <h5 className="mb-2">{message}</h5>
            <p className="mb-0 small">
              {message.includes('No data') 
                ? 'There are no items to display at the moment.' 
                : 'Try adjusting your search or filters to find what you\'re looking for.'
              }
            </p>
          </div>
          {action && (
            <div className="empty-action">
              {action}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TableEmpty;
