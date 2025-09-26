import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  subtitle?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  subtitle,
  className = ''
}) => {
  return (
    <div className={`col-md-3 ${className}`}>
      <div className={`card bg-${color} text-white`}>
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <h6 className="card-title mb-0">{title}</h6>
              <h3 className="mb-0">{value}</h3>
              {subtitle && <small className="opacity-75">{subtitle}</small>}
            </div>
            {icon && (
              <div className="fs-1">
                <i className={icon}></i>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatsGridProps {
  stats: StatsCardProps[];
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  className = ''
}) => {
  return (
    <div className={`row mb-4 ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCard;
