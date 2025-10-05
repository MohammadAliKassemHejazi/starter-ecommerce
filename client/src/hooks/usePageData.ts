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
    loadUserPackage = false,
  } = options;

  const router = useRouter();
  const {
    isAuthenticated,
    hasActiveSubscription,
    user,
    isSuperAdmin,
    isAuthenticating, // ← add this
  } = usePermissions();

  const [userPackage, setUserPackage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadUserPackageData = useCallback(async () => {
    if (!loadUserPackage) {return;}
    try {
      const packageData = await getUserActivePackage();
      setUserPackage(packageData);
    } catch (error) {
      console.error('Error loading user package:', error);
    }
  }, [loadUserPackage]);

  useEffect(() => {
    const initializePage = async () => {
      // ⏳ Wait until auth check is complete
      if (isAuthenticating) {
        setLoading(true);
        return; // Don't redirect or proceed yet
      }

      setLoading(true);

      // 🔒 Now it's safe to check auth status
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
        setLoading(false);
        return;
      }

      await loadUserPackageData();
      setLoading(false);
    };

    initializePage();
  }, [
    isAuthenticated,
    isAuthenticating, // ← include in deps
    requireAuth,
    redirectTo,
    router,
    loadUserPackageData,
  ]);

  // Optional: Show loader while authenticating
  if (isAuthenticating) {
    return {
      isAuthenticated: false,
      hasActiveSubscription: false,
      user: null,
      userPackage: null,
      isSuperAdmin: false,
      loading: true,
    };
  }

  return {
    isAuthenticated,
    hasActiveSubscription,
    user,
    userPackage,
    isSuperAdmin,
    loading,
  };
};

export default usePageData;
