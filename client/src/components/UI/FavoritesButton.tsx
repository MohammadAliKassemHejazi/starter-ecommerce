import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/store';
import { 
  addToFavorites, 
  removeFromFavorites, 
  addToGuestFavorites,
  removeFromGuestFavorites,
  isProductInFavoritesSelector 
} from '@/store/slices/favoritesSlice';
import Swal from 'sweetalert2';

interface FavoritesButtonProps {
  productId: string;
  productName?: string;
  product?: any; // Product data needed for guest favorites
  variant?: 'icon' | 'button' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const FavoritesButton: React.FC<FavoritesButtonProps> = ({
  productId,
  productName = 'Product',
  product,
  variant = 'icon',
  size = 'md',
  className = '',
  showText = true,
}) => {
  const dispatch = useAppDispatch();
  const isInFavorites = useSelector(isProductInFavoritesSelector(productId));
  const isAdding = useSelector((state: RootState) => state.favorites.isAdding);
  const isRemoving = useSelector((state: RootState) => state.favorites.isRemoving);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const isGuest = useSelector((state: RootState) => state.user.isGuest);

  const handleToggleFavorite = async () => {
    try {
      if (isInFavorites) {
        if (isGuest) {
          await dispatch(removeFromGuestFavorites(productId)).unwrap();
        } else {
          await dispatch(removeFromFavorites(productId)).unwrap();
        }
        Toast.fire({
          icon: 'success',
          title: `${productName} removed from favorites`,
        });
      } else {
        if (isGuest) {
          if (!product) {
            Toast.fire({
              icon: 'error',
              title: 'Product data is required for guest favorites',
            });
            return;
          }
          await dispatch(addToGuestFavorites(product)).unwrap();
        } else {
          await dispatch(addToFavorites(productId)).unwrap();
        }
        Toast.fire({
          icon: 'success',
          title: `${productName} added to favorites`,
        });
      }
    } catch (error: any) {
      Toast.fire({
        icon: 'error',
        title: error || 'Something went wrong',
      });
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'btn-sm';
      case 'lg':
        return 'btn-lg';
      default:
        return '';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'fa-sm';
      case 'lg':
        return 'fa-lg';
      default:
        return '';
    }
  };

  const isDisabled = isAdding || isRemoving;

  if (variant === 'icon') {
    return (
      <button
        className={`btn btn-link p-0 border-0 bg-transparent ${className}`}
        onClick={handleToggleFavorite}
        disabled={isDisabled}
        title={isInFavorites ? 'Remove from favorites' : 'Add to favorites'}
        style={{ 
          color: isInFavorites ? 'var(--bs-danger)' : 'var(--bs-secondary)',
          transition: 'color 0.3s ease',
          cursor: isDisabled ? 'not-allowed' : 'pointer'
        }}
      >
        <span 
          className={`${isInFavorites ? 'fas' : 'far'} fa-heart ${getIconSize()}`}
          style={{ 
            opacity: isDisabled ? 0.6 : 1,
            transition: 'all 0.3s ease'
          }}
        />
        {showText && (
          <span className="ms-1">
            {isInFavorites ? 'Remove' : 'Add'}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        className={`btn btn-link p-0 text-decoration-none ${className}`}
        onClick={handleToggleFavorite}
        disabled={isDisabled}
        style={{ 
          color: isInFavorites ? 'var(--bs-danger)' : 'var(--bs-secondary)',
          transition: 'color 0.3s ease',
          cursor: isDisabled ? 'not-allowed' : 'pointer'
        }}
      >
        <span 
          className={`${isInFavorites ? 'fas' : 'far'} fa-heart ${getIconSize()}`}
          style={{ 
            opacity: isDisabled ? 0.6 : 1,
            transition: 'all 0.3s ease'
          }}
        />
        {showText && (
          <span className="ms-1">
            {isInFavorites ? 'Remove from favorites' : 'Add to favorites'}
          </span>
        )}
      </button>
    );
  }

  // Default button variant
  return (
    <button
      className={`btn ${isInFavorites ? 'btn-danger' : 'btn-outline-danger'} ${getSizeClasses()} ${className}`}
      onClick={handleToggleFavorite}
      disabled={isDisabled}
    >
      <span className={`${isInFavorites ? 'fas' : 'far'} fa-heart ${getIconSize()}`}></span>
      {showText && (
        <span className="ms-2">
          {isInFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
        </span>
      )}
      {isDisabled && (
        <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
      )}
    </button>
  );
};

export default FavoritesButton;
