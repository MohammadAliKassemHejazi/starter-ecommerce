import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface CheckoutGuardProps {
  children: React.ReactNode;
}

const CheckoutGuard: React.FC<CheckoutGuardProps> = ({ children }) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = user?.isAuthenticated || false;

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const returnUrl = router.asPath;
      router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default CheckoutGuard;
