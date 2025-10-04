import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PageLayout } from '@/components/UI/PageComponents';
import ProtectedRoute from "@/components/protectedRoute";
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { useAppDispatch } from '@/store/store';
import { useSelector } from 'react-redux';
import { showToast } from '@/components/UI/PageComponents/ToastConfig';
import CheckoutPage from './payment/checkoutwithstripe';
import { getAllPackages, activatePackage, selectAllPackages, selectPackageLoading, selectPackageError } from '@/store/slices/packageSlice';

interface Package {
  id: string;
  name: string;
  description?: string;
  storeLimit: number;
  categoryLimit: number;
  productLimit: number;
  userLimit: number;
  isSuperAdminPackage: boolean;
  price: number;
  isActive: boolean;
}

const PlansPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, hasActiveSubscription, user } = usePermissions();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  
  const packages = useSelector(selectAllPackages);
  const loading = useSelector(selectPackageLoading);
  const error = useSelector(selectPackageError);

  useEffect(() => {
    dispatch(getAllPackages());
  }, [dispatch]);
  
  useEffect(() => {
    if (error) {
      showToast.error(error || 'Failed to load packages');
    }
  }, [error]);

  const handleSelectPackage = (pkg: Package) => {
    if (pkg.price === 0) {
      // Free package - activate directly
      handleActivateFreePackage(pkg);
    } else {
      // Paid package - show payment
      setSelectedPackage(pkg);
      setShowPayment(true);
    }
  };

  const handleActivateFreePackage = async (pkg: Package) => {
    try {
      const resultAction = await dispatch(activatePackage(pkg.id));
      
      if (activatePackage.fulfilled.match(resultAction)) {
        showToast.success('Package activated successfully!');
        router.push('/dashboard');
      } else if (activatePackage.rejected.match(resultAction)) {
        throw new Error(resultAction.payload as string || 'Failed to activate package');
      }
    } catch (error: any) {
      console.error('Error activating package:', error);
      showToast.error(error.message || 'Failed to activate package');
    }
  };

  const handlePaymentSuccess = () => {
    showToast.success('Payment successful! Package activated.');
    setShowPayment(false);
    setSelectedPackage(null);
    router.push('/dashboard');
  };

  const handlePaymentError = (error: string) => {
    showToast.error(`Payment failed: ${error}`);
  };

  const PackageCard = ({ pkg }: { pkg: Package }) => (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className={`card h-100 ${pkg.isSuperAdminPackage ? 'border-warning' : ''}`}>
        {pkg.isSuperAdminPackage && (
          <div className="card-header bg-warning text-dark text-center">
            <strong>Super Admin Package</strong>
          </div>
        )}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-center">{pkg.name}</h5>
          {pkg.description && (
            <p className="card-text text-center text-muted">{pkg.description}</p>
          )}
          
          <div className="text-center mb-4">
            <h2 className="text-primary">
              {pkg.price === 0 ? 'Free' : `$${pkg.price}/month`}
            </h2>
          </div>

          <ul className="list-unstyled mb-4">
            <li className="mb-2">
              <i className="bi bi-check-circle text-success me-2"></i>
              <strong>Stores:</strong> {pkg.storeLimit === -1 ? 'Unlimited' : pkg.storeLimit}
            </li>
            <li className="mb-2">
              <i className="bi bi-check-circle text-success me-2"></i>
              <strong>Categories:</strong> {pkg.categoryLimit === -1 ? 'Unlimited' : pkg.categoryLimit}
            </li>
            <li className="mb-2">
              <i className="bi bi-check-circle text-success me-2"></i>
              <strong>Products:</strong> {pkg.productLimit === -1 ? 'Unlimited' : pkg.productLimit}
            </li>
            <li className="mb-2">
              <i className="bi bi-check-circle text-success me-2"></i>
              <strong>Users:</strong> {pkg.userLimit === -1 ? 'Unlimited' : pkg.userLimit}
            </li>
            {pkg.isSuperAdminPackage && (
              <li className="mb-2">
                <i className="bi bi-star text-warning me-2"></i>
                <strong>Super Admin Access</strong>
              </li>
            )}
          </ul>

          <div className="mt-auto">
            <button
              className={`btn w-100 ${pkg.price === 0 ? 'btn-success' : 'btn-primary'}`}
              onClick={() => handleSelectPackage(pkg)}
              disabled={!isAuthenticated}
            >
              {pkg.price === 0 ? 'Activate Free' : 'Subscribe Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const CurrentSubscriptionInfo = () => {
    if (!isAuthenticated || !hasActiveSubscription()) { return null };

    return (
      <div className="alert alert-info mb-4">
        <h5><i className="bi bi-info-circle me-2"></i>Current Subscription</h5>
        <p className="mb-0">
          You currently have an active subscription. 
          <button 
            className="btn btn-link p-0 ms-2"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </button>
        </p>
      </div>
    );
  };

  const LoginPrompt = () => (
    <div className="alert alert-warning mb-4">
      <h5><i className="bi bi-exclamation-triangle me-2"></i>Login Required</h5>
      <p className="mb-0">
        Please <button 
          className="btn btn-link p-0"
          onClick={() => router.push('/auth/signin')}
        >
          sign in
        </button> to subscribe to a plan.
      </p>
    </div>
  );

  if (showPayment && selectedPackage) {
    return (
      <CheckoutPage
        package={selectedPackage}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        onCancel={() => setShowPayment(false)}
      />
    );
  }

  if (loading) {
    return (
      <PageLayout title="Subscription Plans" subtitle="Choose the perfect plan for your business" protected={false}>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Subscription Plans" subtitle="Choose the perfect plan for your business" protected={false}>
      <CurrentSubscriptionInfo />
      {!isAuthenticated && <LoginPrompt />}
      
      <div className="row">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </PageLayout>
  );
};

export default function ProtectedPlansPage() {
  return (
    <ProtectedRoute>
      <PlansPage />
    </ProtectedRoute>
  );
}