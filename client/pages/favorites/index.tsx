import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/store';
import Layout from '@/components/Layouts/Layout';
import ProtectedRoute from '@/components/protectedRoute';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { fetchFavorites, removeFromFavorites, favoritesSelector, favoritesLoadingSelector } from '@/store/slices/favoritesSlice';

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

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleRemoveFromFavorites = async (productId: string) => {
    try {
      await dispatch(removeFromFavorites(productId)).unwrap();
      Toast.fire({
        icon: 'success',
        title: 'Removed from favorites',
      });
    } catch (error: any) {
      console.error('Error removing from favorites:', error);
      Toast.fire({
        icon: 'error',
        title: error || 'Failed to remove from favorites',
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4 text-center fw-bold">My Favorites</h1>
            
            {favorites.length === 0 ? (
              <div className="text-center py-5">
                <h3 className="text-muted">No favorites yet</h3>
                <p className="text-muted">Start adding products to your favorites!</p>
                <Link href="/shop" className="btn btn-primary">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="row">
                {favorites.map((favorite) => (
                  <div key={favorite.id} className="col-md-4 col-lg-3 mb-4">
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default function ProtectedFavoritesPage() {
  return (
    <ProtectedRoute>
      <FavoritesPage />
    </ProtectedRoute>
  );
}
