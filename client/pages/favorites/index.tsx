import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/store';
import { PageLayout } from '@/components/UI/PageComponents';
import { usePageData } from '@/hooks/usePageData';
import Image from 'next/image';
import Link from 'next/link';
import { showToast, showConfirm } from '@/components/UI/PageComponents/ToastConfig';
import ProtectedRoute from '@/components/protectedRoute';
import { fetchFavorites, removeFromFavorites, favoritesSelector, favoritesLoadingSelector } from '@/store/slices/favoritesSlice';

interface Favorite {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    images: Array<{ imageUrl: string }>;
  };
}

const FavoritesPage = () => {
  const dispatch = useAppDispatch();
  const favorites = useSelector(favoritesSelector);
  const loading = useSelector(favoritesLoadingSelector);
  const { isAuthenticated } = usePageData();

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleRemoveFromFavorites = async (productId: string) => {
    const result = await showConfirm({
      title: 'Remove from Favorites',
      text: 'Are you sure you want to remove this product from your favorites?',
      confirmText: 'Remove',
      cancelText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(removeFromFavorites(productId)).unwrap();
        showToast.success('Removed from favorites');
      } catch (error: any) {
        console.error('Error removing from favorites:', error);
        showToast.error(error || 'Failed to remove from favorites');
      }
    }
  };

  const FavoriteCard = ({ favorite }: { favorite: Favorite }) => (
    <div className="col-md-4 col-lg-3 mb-4">
      <div className="card h-100">
        {favorite.product.images && favorite.product.images.length > 0 && (
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL_Images}${favorite.product.images[0].imageUrl}`}
            alt={favorite.product.name}
            className="card-img-top"
            width={300}
            height={200}
            style={{ objectFit: 'cover' }}
          />
        )}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{favorite.product.name}</h5>
          <p className="card-text text-muted">
            {favorite.product.description ? favorite.product.description.substring(0, 100) + '...' : ''}
          </p>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="h5 text-primary">
                ${favorite.product.price}
              </span>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleRemoveFromFavorites(favorite.product.id)}
              >
                <i className="bi bi-heart-fill"></i> Remove
              </button>
            </div>
            <Link
              href={`/shop/product/${favorite.product.id}`}
              className="btn btn-primary w-100"
            >
              View Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyFavorites = () => (
    <div className="text-center py-5">
      <h3 className="text-muted">No favorites yet</h3>
      <p className="text-muted">Start adding products to your favorites!</p>
      <Link href="/shop" className="btn btn-primary">
        Browse Products
      </Link>
    </div>
  );

  const FavoritesGrid = () => (
    <div className="row">
      {favorites.map((favorite) => (
        <FavoriteCard key={favorite.id} favorite={favorite} />
      ))}
    </div>
  );

  if (loading) {
    return (
      <PageLayout title="My Favorites" protected={true}>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="My Favorites" 
      subtitle="Your saved products"
      protected={true}
      headerActions={
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">
            {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
          </span>
        </div>
      }
    >
      {favorites.length === 0 ? <EmptyFavorites /> : <FavoritesGrid />}
    </PageLayout>
  );
};

export default function ProtectedFavoritesPage() {
  return (
    <ProtectedRoute>
      <FavoritesPage />
    </ProtectedRoute>
  );
}