import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { requestProductsByStore, requestProductsListing } from '@/services/shopService';
import { IProductModel } from '@/models/product.model';

interface SuggestedProductsProps {
  currentProduct: IProductModel;
}

const SuggestedProducts: React.FC<SuggestedProductsProps> = ({ currentProduct }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      setLoading(true);
      try {
        let response;
 
        if (currentProduct.storeId) {
          
          // Fetch products from the same store
          response = await requestProductsByStore(currentProduct.storeId, 1, 5,'', '');
        } else {
           // Fallback to random listing
          response = await requestProductsListing(1, 5);
        }

        if (response && response.data && Array.isArray(response.data)) {
          // Filter out the current product
          const filtered = response.data.filter((p: any) => p.id !== currentProduct.id);
          setProducts(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch suggested products", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentProduct) {
      fetchSuggestedProducts();
    }
  }, [currentProduct]);

  if (loading) {
    return <div>Loading suggested products...</div>;
  }
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="suggested-products-container mt-5">
      <h3 className="mb-4">Suggested Products</h3>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-6 col-md-3 mb-4">
            <Link href={`/shop/product/${product.id}`} className="text-decoration-none text-dark">
              <div className="card h-100 border-0 shadow-sm hover-shadow">
                <div className="position-relative" style={{ height: '200px' }}>
                  <Image
                    src={
                      product.photos && product.photos.length > 0
                        ? process.env.NEXT_PUBLIC_BASE_URL_Images + product.photos[0].imageUrl
                        : (product.productImages && product.productImages.length > 0
                            ? process.env.NEXT_PUBLIC_BASE_URL_Images + product.productImages[0].url
                            : '/images/placeholder.png')
                    }
                    alt={product.name}
                    fill
                    className="card-img-top object-fit-contain p-2"
                  />
                </div>
                <div className="card-body">
                  <h6 className="card-title text-truncate" title={product.name}>
                    {product.name}
                  </h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary">${product.price.toFixed(2)}</span>
                    {product.discount > 0 && (
                      <span className="text-decoration-line-through text-muted small">
                        ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedProducts;
