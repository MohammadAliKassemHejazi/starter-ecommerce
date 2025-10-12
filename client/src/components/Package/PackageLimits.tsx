import React, { useState, useEffect } from 'react';
import { getUserPackageLimits, IPackageLimits } from '@/services/packageService';
import { Card, Row, Col, Badge } from 'react-bootstrap';
// Assuming you have a standard icon library like react-icons or Font Awesome included
// For this example, we'll use placeholder icons.

// --- Helper Components for Compact Display ---

interface LimitItemProps {
  icon: string; // Placeholder for an icon class or component
  label: string;
  current: number;
  limit: number;
}

const LimitItem: React.FC<LimitItemProps> = ({ icon, label, current, limit }) => {
  const isUnlimited = limit === -1;
  const isBlocked = limit === 0;
  const percentage = isUnlimited || isBlocked ? 0 : (current / limit) * 100;
  
  let variant: 'success' | 'warning' | 'danger' = 'success';
  let statusText = isUnlimited ? 'Unlimited' : `${current} / ${limit}`;
  let iconColor = 'text-success';
  
  if (isBlocked) {
    variant = 'danger';
    statusText = 'Blocked';
    iconColor = 'text-danger';
  } else if (!isUnlimited && percentage >= 90) {
    variant = 'danger';
    iconColor = 'text-danger';
  } else if (!isUnlimited && percentage >= 70) {
    variant = 'warning';
    iconColor = 'text-warning';
  }

  const isAtLimit = !isUnlimited && current >= limit;
  
  return (
    <div className="text-center p-2">
      {/* Visual Circle Indicator */}
      <div className={`limit-circle d-inline-flex justify-content-center align-items-center mb-1 bg-light ${iconColor}`}>
        <i className={`${icon} fa-lg`}></i>
      </div>
      
      {/* Label and Badge Status */}
      <p className="small text-muted mb-1 fw-medium">{label}</p>
      <Badge pill bg={variant} className="small">
        {isAtLimit ? 'Limit Reached' : statusText}
      </Badge>
    </div>
  );
};


// --- Main Component ---

export const PackageLimits: React.FC = () => {
  const [limits, setLimits] = useState<IPackageLimits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLimits();
  }, []);

  const loadLimits = async () => {
    try {
      const data = await getUserPackageLimits();
      const cleanData = data.data;
      setLimits(cleanData as any);
    } catch (error) {
      console.error('Error loading package limits:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      // Simple, cute loading card
      <Card className="p-3 shadow-sm border-0">
        <div className="loading-pulse text-center">
          <div className="loading-bar w-50 mb-3 mx-auto"></div>
          <div className="d-flex justify-content-around">
            <div className="loading-circle"></div>
            <div className="loading-circle"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!limits) {
    return (
      <Card className="p-3 shadow-sm border-0">
        <p className="small text-center mb-0 text-danger">⚠️ Limits unavailable</p>
      </Card>
    );
  }

  return (
    <Card className="p-3 shadow-sm border-0">
      <h6 className="fw-bold mb-3 text-center text-primary">Package Limits</h6>
      
      <Row className="g-0 justify-content-center">
        {/* Store Limits */}
        <Col xs={4}>
          <LimitItem 
            icon="fa fa-store" 
            label="Stores" 
            current={limits.currentStoreCount} 
            limit={limits.storeLimit}
          />
        </Col>

        {/* Product Limits */}
        <Col xs={4}>
          <LimitItem 
            icon="fa fa-box" 
            label="Products" 
            current={limits.currentProductCount} 
            limit={limits.productLimit}
          />
        </Col>

        {/* User Limits (for super admins) */}
        {limits.isSuperAdmin && (
          <Col xs={4}>
            <LimitItem 
              icon="fa fa-users" 
              label="Users" 
              current={limits.currentUserCount} 
              limit={limits.userLimit}
            />
          </Col>
        )}
      </Row>

      {/* Quick Access Indicators (Small dots) */}
      <div className="border-top pt-2 mt-2 d-flex justify-content-around small">
        <div className="d-flex align-items-center">
          <div className={`status-dot me-1 ${limits.canCreateStore ? 'bg-success' : 'bg-danger'}`}></div>
          <span className="text-muted">Store Access</span>
        </div>
        <div className="d-flex align-items-center">
          <div className={`status-dot me-1 ${limits.canCreateProduct ? 'bg-success' : 'bg-danger'}`}></div>
          <span className="text-muted">Product Access</span>
        </div>
      </div>
    </Card>
  );
};