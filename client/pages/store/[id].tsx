import React, { useState, useEffect } from "react";
import Layout from "@/components/Layouts/Layout";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { singleStoreSelector } from "@/store/slices/storeSlice";
import { fetchProductsByStore, productByStoreSelector } from "@/store/slices/shopSlice";
import Image from "next/image";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { requestAllStoresForUser, requestStoreById } from "@/services/storeService";

import ErrorBoundary from "@/components/Error/ErrorBoundary";
import ProtectedRoute from "@/components/protectedRoute";
import { setAuthHeaders } from "@/utils/httpClient";
import ListingProductsByStore from "@/components/UI/General/listingProducts/ListingProductsByStore";

import { GetStaticPaths, GetStaticProps } from "next";
import { IProductModel } from "@/models/product.model";

interface IParams extends ParsedUrlQuery {
  id: string;
}

interface SingleStoreProps {
  initialStore?: {
    id: string;
    name: string;
    description?: string;
    imgUrl: string;
    categoryId: string;
    metaTitle?: string;
    metaDescription?: string;
  };
  initialProducts?: Array<{
    page: number;
    pageSize: number;
    total: number;
    products: IProductModel[];

  }>;
}

const SingleStore = ({ initialStore, initialProducts }: SingleStoreProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = router.query;
  const store = useSelector(singleStoreSelector) || initialStore;
  const products = useSelector(productByStoreSelector) || initialProducts?.[0]?.products || [];




  useEffect(() => {
    if (id && typeof id === "string") {
      dispatch(
        fetchProductsByStore({
          storeId: id,
          page: 1,
          pageSize: 20,
          searchQuery: "",
        })
      );
    }
  }, [dispatch, id]);

 




  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: store?.name ?? "",
    description: store?.description ?? "",
    image: store?.imgUrl ?? "",
  };

  if (router.isFallback) {
    return <div className="text-center p-8">Loading store details...</div>;
  }

  if (!store) {
    return (
      <ErrorBoundary message="Store not found">
        <></>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Head>
     
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          id={`structured-data-${store.id}`}
        />
      </Head>
      <Layout>
        {/* Store Header */}
<div className="store-header relative h-64 md:h-80 flex items-center justify-center overflow-hidden rounded-lg shadow-md">
  {/* Background Image */}
  <Image
    src={process.env.NEXT_PUBLIC_BASE_URL_Images + store.imgUrl}
    alt={store.name}
    fill
    priority
    className="object-cover opacity-70 transition-transform duration-500 hover:scale-110"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />

  {/* Overlay for better contrast */}
  <div className="overlay absolute top-0 left-0 w-full h-full bg-black/30"></div>

  {/* Store Info Content */}
  <div className="content absolute text-center px-4 py-4 z-10">
    <h1 className="text-4xl md:text-5xl font-bold mb-2">{store.name}</h1>
    <p className="text-lg md:text-xl mb-4">{store.description}</p>
    <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
      {store.categoryId}
    </span>
  </div>
</div>

        {/* Product Sorting Dropdown */}
        <div className="container mx-auto py-8 px-4">
        
        
          
       
            
              <ListingProductsByStore  storeId={store.id ?? ""} />
          
        
        </div>
      </Layout>
    </ErrorBoundary>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await requestAllStoresForUser();
    const stores = response?.data;

    if (!Array.isArray(stores) || stores.length === 0) {
      return { paths: [], fallback: "blocking" };
    }

    const paths = stores
      .filter((store: any) => store && store.id)
      .map((store: any) => ({
        params: { id: store.id.toString() },
      }));

    return { paths, fallback: "blocking" };
  } catch (error) {
    console.error("Error generating static paths:", error);
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps: GetStaticProps<SingleStoreProps> = async (context) => {
  const { id } = context.params as IParams;

  try {
    const [store] = await Promise.all([
      requestStoreById(id),

    ]); 
    

    if (!store) {
      return { notFound: true };
    }

    return {
      props: {
        initialStore: store.data,
  
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error(`Error fetching data for store ${id}:`, error);
    return { notFound: true };
  }
};

export async function generateMetadata({ params }: { params: { id: string } }, context: any) {
  try {
    const headers = context.req.headers;
    setAuthHeaders(headers);
    const store = await requestStoreById(params.id);

    if (!store) {
      return {
        title: "Store Not Found",
        description: "The requested store could not be found.",
      };
    }

    return {
      title: store?.data?.metaTitle || store?.data?.name || "Store Page",
      description: store?.data?.metaDescription || store?.data?.description || "Discover our products",
      openGraph: {
        title: store?.data?.metaTitle || store?.data?.name || "Store Page",
        description: store?.data?.metaDescription || store?.data?.description || "Discover our products",
        images: [{ url: store?.data?.imgUrl || "/default-store-image.jpg" }],
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/stores/${params.id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: store?.data?.metaTitle || store?.data?.name || "Store Page",
        description: store?.data?.metaDescription || store?.data?.description || "Discover our products",
        image: store?.data?.imgUrl || "/default-store-image.jpg",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Store Page",
      description: "Discover our wide range of products",
    };
  }
}

export default function ProtectedSingleStore() {
  return (
    <ProtectedRoute>
      <SingleStore />
    </ProtectedRoute>
  );
}