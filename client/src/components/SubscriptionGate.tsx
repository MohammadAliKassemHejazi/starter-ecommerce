import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { usePermissions } from '@/hooks/usePermissions';
import { ROLES } from '@/constants/permissions';

interface SubscriptionGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireSubscription?: boolean;
  allowedActions?: string[];
}

// Client-side only component that uses hooks
const ClientSubscriptionGate: React.FC<SubscriptionGateProps> = ({
  children,
  fallback = null,
  requireSubscription = true,
  allowedActions = [],
}) => {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isSuperAdmin, user } = usePermissions();
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!isAuthenticated) {
        setHasActiveSubscription(false);
        return;
      }

      // Super admins always have access
      if (isSuperAdmin()) {
        setHasActiveSubscription(true);
        return;
      }
      
      // Admins always have access
      if (isAdmin()) {
        setHasActiveSubscription(true);
        return;
      }

      // Check if user has an active subscription
      const subscription = user?.subscription;
      if (subscription && subscription.isActive) {
        setHasActiveSubscription(true);
      } else {
        setHasActiveSubscription(false);
      }
    };

    checkSubscription();
  }, [isAuthenticated, isAdmin, isSuperAdmin, user]);

  // Show loading state while checking subscription
  if (hasActiveSubscription === null) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If subscription is not required, show content
  if (!requireSubscription) {
    return <>{children}</>;
  }

  // If user has active subscription, show content
  if (hasActiveSubscription) {
    return <>{children}</>;
  }

  // If user doesn't have subscription, show fallback or redirect to plans
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback - redirect to plans page
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <i className="fas fa-crown fa-3x text-warning mb-3"></i>
                <h2 className="card-title">Subscription Required</h2>
                <p className="card-text text-muted">
                  You need an active subscription to access this feature. Choose a plan that fits your needs.
                </p>
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => router.push('/packages')}
                >
                  View Plans
                </button>
                <button 
                  className="btn btn-outline-secondary btn-lg"
                  onClick={() => router.back()}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component that handles client-side rendering
const SubscriptionGate: React.FC<SubscriptionGateProps> = (props) => {
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything on server side
  if (!isClient) {
    return null;
  }

  // Render the client-side component
  return <ClientSubscriptionGate {...props} />;
};

// Convenience components for common subscription patterns
export const SubscribedOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <SubscriptionGate requireSubscription={true} fallback={fallback}>
    {children}
  </SubscriptionGate>
);

export const FreeUserOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <SubscriptionGate requireSubscription={false} fallback={fallback}>
    {children}
  </SubscriptionGate>
);

export default SubscriptionGate;
