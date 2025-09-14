import React from 'react';

interface LoadingStateProps {
  loading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  spinner?: React.ReactNode;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  children,
  skeleton,
  spinner,
  text = 'Loading...',
  size = 'md',
  className = ''
}) => {
  if (!loading) {
    return <>{children}</>;
  }

  if (skeleton) {
    return <>{skeleton}</>;
  }

  if (spinner) {
    return <>{spinner}</>;
  }

  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };

  return (
    <div className={`d-flex flex-column align-items-center justify-content-center p-5 ${className}`}>
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      <div className="mt-3 text-muted">{text}</div>
    </div>
  );
};

// Skeleton components for common loading states
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="table-responsive">
    <table className="table">
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i}>
              <div className="placeholder-glow">
                <span className="placeholder col-6"></span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            {Array.from({ length: columns }).map((_, j) => (
              <td key={j}>
                <div className="placeholder-glow">
                  <span className="placeholder col-8"></span>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="row">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="col-md-4 mb-3">
        <div className="card">
          <div className="card-body">
            <div className="placeholder-glow">
              <span className="placeholder col-6 mb-2"></span>
              <span className="placeholder col-8 mb-2"></span>
              <span className="placeholder col-4"></span>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => (
  <div className="card">
    <div className="card-body">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="mb-3">
          <div className="placeholder-glow">
            <span className="placeholder col-3 mb-2"></span>
            <span className="placeholder col-12"></span>
          </div>
        </div>
      ))}
      <div className="d-flex justify-content-end gap-3">
        <div className="placeholder-glow">
          <span className="placeholder col-3"></span>
          <span className="placeholder col-3"></span>
        </div>
      </div>
    </div>
  </div>
);

export default LoadingState;
