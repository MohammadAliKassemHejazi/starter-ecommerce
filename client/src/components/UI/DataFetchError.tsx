import React from 'react';

interface DataFetchErrorProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

const DataFetchError: React.FC<DataFetchErrorProps> = ({
  error,
  onRetry,
  className = ''
}) => {
  return (
    <div className={`alert alert-warning d-flex flex-column align-items-center justify-content-center p-5 ${className}`} role="alert">
      <div className="mb-3">
        <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '3rem' }}></i>
      </div>
      <h4 className="alert-heading fw-bold mb-2">We encountered a problem</h4>
      <p className="text-muted text-center mb-4">
        We are having trouble loading this content right now. Our team is working on solving it.
        <br />
        <small className="text-secondary">Error details: {error}</small>
      </p>
      {onRetry && (
        <button
          className="btn btn-outline-warning"
          onClick={onRetry}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Try Again
        </button>
      )}
    </div>
  );
};

export default DataFetchError;
