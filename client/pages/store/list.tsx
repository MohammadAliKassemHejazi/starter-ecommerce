import Layout from "@/components/Layouts/Layout";
import React, { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { useRouter } from "next/router";
import {
  fetchAllStores,
  storeSelector,
} from "@/store/slices/storeSlice";
import { useSelector } from "react-redux";
import protectedRoute from "@/components/protectedRoute";
import Image from "next/image";

const StoreListing = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Fetch list of stores from the selector
  const listOfStores = useSelector(storeSelector);

  // Fetch all stores on component mount
  useEffect(() => {
    dispatch(fetchAllStores());
  }, [dispatch]);

  // Navigate to single store page
  const handleStoreClick = (storeId: string) => {
    router.push(`/store/${storeId}`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="hero-section relative h-64 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center">
        <h1 className="text-4xl font-bold">Explore Our Stores</h1>
        <p className="text-lg mt-2">
          Discover amazing products and categories from various stores.
        </p>
      </div>

      {/* Store Listing */}
      <div className="container mx-auto py-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Stores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listOfStores &&
            listOfStores.map((store) => (
              <div
                key={store.id}
                className="store-card bg-white rounded-lg shadow-lg p-4 cursor-pointer"
                onClick={() => handleStoreClick(store.id)}
              >
                <Image
                  src={store.imgUrl}
                  alt={store.name}
                  width={300}
                  height={200}
                  className="rounded"
                />
                <h3 className="text-lg font-semibold mt-4">{store.name}</h3>
                <span className="badge bg-blue-500 text-white px-3 py-1 rounded-full mt-2 inline-block">
                  {store.categoryId}
                </span>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default protectedRoute(StoreListing);
