import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { usePermissions } from './usePermissions';
import { getUserActivePackage } from '@/services/packageService';

interface UsePageDataOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  loadUserPackage?: boolean;
}

export const usePageData = (options: UsePageDataOptions = {}) => {
  const {
    requireAuth = true,
    redirectTo = '/auth/signin',
    loadUserPackage = false
  } = options;

  const router = useRouter();
  const { isAuthenticated, hasActiveSubscription, user ,isSuperAdmin } = usePermissions();
  const [userPackage, setUserPackage] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const loadUserPackageData = useCallback(async () => {
    if (!loadUserPackage) { return };
    
    try {
      const packageData = await getUserActivePackage();
      setUserPackage(packageData);

    } catch (error) {
      console.error('Error loading user package:', error);
    }
  }, [loadUserPackage]);

  useEffect(() => {
    const initializePage = async () => {
      setLoading(true);
      
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      await loadUserPackageData();
      setLoading(false);
    };

    initializePage();
  }, [isAuthenticated, requireAuth, redirectTo, router, loadUserPackageData]);

  return {
    isAuthenticated,
    hasActiveSubscription,
    user,
    userPackage,
    isSuperAdmin,
    loading
  };
};

export default usePageData;
