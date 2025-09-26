import React from 'react';

interface TableLoadingProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TableLoading: React.FC<TableLoadingProps> = ({
  message = 'Loading...',
  className = '',
  size = 'md'
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'sm': return 'spinner-border-sm';
      case 'lg': return 'spinner-border-lg';
      default: return '';
    }
  };

  return (
    <div className={`table-loading ${className}`}>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th colSpan={5} className="text-center py-5">
                <div className="d-flex flex-column align-items-center">
                  <div className={`spinner-border text-primary ${getSpinnerSize()}`} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="mt-3 text-muted">
                    <i className="bi bi-hourglass-split me-2"></i>
                    {message}
                  </div>
                </div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default TableLoading;
