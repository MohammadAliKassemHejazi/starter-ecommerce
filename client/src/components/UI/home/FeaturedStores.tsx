import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { fetchPublicStores, selectPublicStores, selectPublicErrors } from "@/store/slices/publicSlice";
import { useAppDispatch } from "@/store/store";
import DataFetchError from "@/components/UI/DataFetchError";

const FeaturedStores: React.FC = () => {
  const dispatch = useAppDispatch();
  const stores = useSelector(selectPublicStores);
  const errors = useSelector(selectPublicErrors);

  useEffect(() => {
    // Only fetch if stores are empty to avoid duplicate calls if already fetched by home page or other components
    if (!stores || stores.length === 0) {
      dispatch(fetchPublicStores());
    }
  }, [dispatch, stores]);

  if (errors.stores) {
    return (
      <section className="py-5" style={{ background: 'var(--bs-component-bg)' }}>
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Featured Stores</h2>
          <DataFetchError
            error={errors.stores}
            onRetry={() => dispatch(fetchPublicStores())}
          />
        </div>
      </section>
    );
  }

  // Display top 4 stores
  const featuredStores = stores?.slice(0, 4) || [];

  if (featuredStores.length === 0) {
    return null;
  }

  return (
    <section className="py-5" style={{ background: 'var(--bs-component-bg)' }}>
      <div className="container">
        <h2 className="text-center mb-5 fw-bold">Featured Stores</h2>
        <div className="row g-4">
          {featuredStores.map((store) => (
            <div key={store.id} className="col-md-3 col-sm-6">
              <Link href={`/store/${store.id}`} className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm text-center p-3 hover-shadow transition-all">
                  <div className="position-relative mx-auto mb-3" style={{ width: "120px", height: "120px" }}>
                    <Image
                      src={
                        store.imgUrl
                          ? `${process.env.NEXT_PUBLIC_BASE_URL_Images}${store.imgUrl}`
                          : `${process.env.NEXT_PUBLIC_BASE_URL_Images}${"placeholder"}` // Fallback image
                      }
                      alt={store.name}
                      fill
                      className="rounded-circle object-fit-cover border"
                    />
                  </div>
                  <div className="card-body p-0">
                    <h5 className="card-title text-truncate fw-bold text-dark">{store.name}</h5>
                    <p className="card-text text-muted small text-truncate">
                      {store.description || "Visit this amazing store!"}
                    </p>
                    <span className="btn btn-outline-primary btn-sm rounded-pill mt-2">
                      Visit Store
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </section>
  );
};

export default FeaturedStores;
