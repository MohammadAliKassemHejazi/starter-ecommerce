import React, { useState } from "react";
import Layout from "@/components/Layouts/Layout";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  singleStoreSelector,
} from "@/store/slices/storeSlice";
import {
  fetchProductsListing,
  productSelector,
} from "@/store/slices/shopSlice";
import Image from "next/image";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";

// Define the interface for the params object
interface IParams extends ParsedUrlQuery {
  id: string;
}

// Define the interface for the component props
interface SingleStoreProps {
  initialStore: {
    id: string;
    name: string;
    description: string;
    imgUrl: string;
    categoryId: string;

  };
  initialProducts: Array<{
    id: string;
    name: string;
    price: number;
    ratings: number;
    photos?: Array<{ imageUrl: string }>;
  }>;
}

const SingleStore = ({ initialStore, initialProducts }: SingleStoreProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = router.query;

  // Selectors
  const store = useSelector(singleStoreSelector) || initialStore;
  const products = useSelector(productSelector) || initialProducts;

  const [sortBy, setSortBy] = useState("default");

  // Fetch products with filters
  const fetchProducts = ({
    storeId,
    page,
    pageSize,
    sortBy,
  }: {
    storeId: string;
    page: number;
    pageSize: number;
    sortBy: string;
  }) => {
    dispatch(
      fetchProductsListing({
        storeId,
        page,
        pageSize,
        sortBy,
      })
    );
  };

  // Handle sort/filter changes
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    fetchProducts({ storeId: id as string, page: 1, pageSize: 20, sortBy: e.target.value });
  };

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: store?.name ?? "",
    description: store?.description ?? "",
    image: store?.imgUrl ?? "",
   
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          id={store?.id ?? ""}
        />
      </Head>
      <Layout>
        {store && (
          <div className="store-header relative h-64 flex items-center justify-center">
            <Image
              src={store.imgUrl}
              alt={store.name}
              layout="fill"
              objectFit="cover"
              className="opacity-70"
            />
            <div className="absolute text-white text-center">
              <h1 className="text-3xl font-bold">{store.name}</h1>
              <p className="text-lg mt-2">{store.description}</p>
              <span className="badge bg-blue-500 text-white px-3 py-1 rounded-full mt-4">
                {store.categoryId}
              </span>
            </div>
          </div>
        )}

        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Products</h2>
            <select
              className="p-2 border rounded"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="default">Sort By</option>
              <option value="rating">Rating</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map((product) => (
              <div
                key={product.id}
                className="product-card bg-white rounded-lg shadow-lg p-4 flex flex-col items-center"
              >
                {product.photos && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL_Images}${product.photos[0]?.imageUrl}`}
                    alt={product.name ?? ""}
                    width={200}
                    height={200}
                    className="rounded"
                  />
                )}
                <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
                <p className="text-sm text-gray-600">
                  ${product.price?.toFixed(2)}
                </p>
                <div className="flex items-center justify-center mt-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`fas fa-star ${
                        i < (product.ratings || 0) ? "text-yellow-400" : "text-gray-300"
                      }`}
                    ></span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SingleStore;

// Fetch all store IDs at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stores`);
  const stores = await res.json();

  const paths = stores.map((store : any ) => ({
    params: { id: store.id.toString() },
  }));

  return {
    paths,
    fallback: "blocking", // Generate pages on-demand if not pre-rendered
  };
};

// Fetch store data and products at build time
export const getStaticProps: GetStaticProps<SingleStoreProps> = async (context) => {
  const { id } = context.params as IParams; // Type assertion to ensure `id` exists

  try {
    // Fetch store data
    const storeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stores/${id}`);
    const store = await storeRes.json();

    // Fetch products for the store
    const productsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?storeId=${id}&page=1&pageSize=20&sortBy=default`
    );
    const products = await productsRes.json();

    if (!store) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        initialStore: store,
        initialProducts: products,
      },
      revalidate: 60 * 60, // Revalidate every hour (ISR)
    };
  } catch (error) {
    console.error("Error fetching store data:", error);
    return {
      notFound: true,
    };
  }
};

// Generate metadata for each store page
export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  const storeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stores/${id}`);
  const store = await storeRes.json();

  return {
    title: store?.metaTitle ?? store?.name ?? "Store Page",
    description: store?.metaDescription ?? store?.description ?? "Store Description",
    openGraph: {
      title: store?.metaTitle ?? store?.name ?? "Store Page",
      description: store?.metaDescription ?? store?.description ?? "Store Description",
      images: [
        {
          url: store?.imgUrl ?? "",
        },
      ],
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/stores/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: store?.metaTitle ?? store?.name ?? "Store Page",
      description: store?.metaDescription ?? store?.description ?? "Store Description",
      image: store?.imgUrl ?? "",
    },
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/stores/${id}`,
  };
}