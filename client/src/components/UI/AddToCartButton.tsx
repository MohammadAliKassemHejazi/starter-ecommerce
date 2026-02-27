import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/store';
import { addToCart } from '@/store/slices/cartSlice';
import { IProductModel } from '@/models/product.model';
import Swal from 'sweetalert2';

interface AddToCartButtonProps {
  product: IProductModel;
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

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = 'icon',
  size = 'md',
  className = '',
  showText = true,
}) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const cartLoading = useSelector((state: RootState) => state.cart.status === 'loading');

  const handleAddToCart = async () => {
    if (!product.id || !product.price) {
      Toast.fire({
        icon: 'error',
        title: 'Product information is incomplete',
      });
      return;
    }

    // For authenticated users, ensure sizeId is provided
    if (isAuthenticated && !product.sizeId) {
      Toast.fire({
        icon: 'warning',
        title: 'Please select a size before adding to cart',
      });
      return;
    }

    // For guests, use default sizeId if not provided
    const productToAdd = {
      ...product,
      sizeId: product.sizeId || 'default'
    };

    try {
      await dispatch(addToCart(productToAdd)).unwrap();
      Toast.fire({
        icon: 'success',
        title: `${product.name} added to cart`,
      });
    } catch (error: any) {
      Toast.fire({
        icon: 'error',
        title: error || 'Failed to add to cart',
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

  const isDisabled = cartLoading || !product.id || !product.price;

  if (variant === 'icon') {
    return (
      <button
        className={`btn btn-link p-0 border-0 bg-transparent ${className}`}
        onClick={handleAddToCart}
        disabled={isDisabled}
        title="Add to cart"
        style={{ 
          color: 'var(--bs-success)',
          transition: 'color 0.3s ease',
          cursor: isDisabled ? 'not-allowed' : 'pointer'
        }}
      >
        <span 
          className={`fas fa-shopping-cart ${getIconSize()}`}
          style={{ 
            opacity: isDisabled ? 0.6 : 1,
            transition: 'all 0.3s ease'
          }}
        />
        {showText && (
          <span className="ms-1">Add to Cart</span>
        )}
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        className={`btn btn-link p-0 text-decoration-none ${className}`}
        onClick={handleAddToCart}
        disabled={isDisabled}
        style={{ 
          color: 'var(--bs-success)',
          transition: 'color 0.3s ease',
          cursor: isDisabled ? 'not-allowed' : 'pointer'
        }}
      >
        <span 
          className={`fas fa-shopping-cart ${getIconSize()}`}
          style={{ 
            opacity: isDisabled ? 0.6 : 1,
            transition: 'all 0.3s ease'
          }}
        />
        {showText && (
          <span className="ms-1">Add to Cart</span>
        )}
      </button>
    );
  }

  // Default button variant
  return (
    <button
      className={`btn btn-success ${getSizeClasses()} ${className}`}
      onClick={handleAddToCart}
      disabled={isDisabled}
    >
      <span className={`fas fa-shopping-cart ${getIconSize()}`}></span>
      {showText && (
        <span className="ms-2">Add to Cart</span>
      )}
      {cartLoading && (
        <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
      )}
    </button>
  );
};

export default AddToCartButton;
