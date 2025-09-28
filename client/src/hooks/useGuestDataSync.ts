import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/store';
import { localStorageService } from '@/services/localStorageService';
import { loadGuestFavorites } from '@/store/slices/favoritesSlice';
import { loadGuestCart } from '@/store/slices/cartSlice';

export const useGuestDataSync = () => {
  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
    // Add a small delay to ensure Redux state is ready
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);
  const isGuest = useSelector((state: any) => state.user.isGuest);

  useEffect(() => {
    // Only run on client side, after initialization, and if user is in guest mode
    if (!isClient || !isInitialized || !isGuest || isAuthenticated) return;

    try {
      // Guest mode: load from local storage
      const guestFavorites = localStorageService.getGuestFavorites();
      if (guestFavorites.length > 0) {
        dispatch(loadGuestFavorites());
      }

      const guestCart = localStorageService.getGuestCart();
      if (guestCart.length > 0) {
        dispatch(loadGuestCart(guestCart));
      }
    } catch (error) {
      console.warn('Error loading guest data:', error);
    }
  }, [dispatch, isAuthenticated, isGuest, isClient, isInitialized]);

  return {
    hasGuestData: isClient && isInitialized ? localStorageService.hasGuestData() : false,
    guestFavoritesCount: isClient && isInitialized ? localStorageService.getGuestFavorites().length : 0,
    guestCartCount: isClient && isInitialized ? localStorageService.getGuestCart().length : 0,
  };
};
