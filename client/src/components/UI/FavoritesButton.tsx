import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/store';
import { addToFavorites, removeFromFavorites, isProductInFavoritesSelector } from '@/store/slices/favoritesSlice';
import Swal from 'sweetalert2';

interface FavoritesButtonProps {
  productId: string;
  productName?: string;
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

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      Toast.fire({
        icon: 'warning',
        title: 'Please sign in to add favorites',
      });
      return;
    }

    try {
      if (isInFavorites) {
        await dispatch(removeFromFavorites(productId)).unwrap();
        Toast.fire({
          icon: 'success',
          title: `${productName} removed from favorites`,
        });
      } else {
        await dispatch(addToFavorites(productId)).unwrap();
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
        className={`btn ${isInFavorites ? 'btn-danger' : 'btn-outline-danger'} ${getSizeClasses()} ${className}`}
        onClick={handleToggleFavorite}
        disabled={isDisabled}
        title={isInFavorites ? 'Remove from favorites' : 'Add to favorites'}
      >
        <i className={`bi ${isInFavorites ? 'bi-heart-fill' : 'bi-heart'} ${getIconSize()}`}></i>
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
      >
        <i className={`bi ${isInFavorites ? 'bi-heart-fill text-danger' : 'bi-heart text-muted'} ${getIconSize()}`}></i>
        {showText && (
          <span className={`ms-1 ${isInFavorites ? 'text-danger' : 'text-muted'}`}>
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
      <i className={`bi ${isInFavorites ? 'bi-heart-fill' : 'bi-heart'} ${getIconSize()}`}></i>
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
