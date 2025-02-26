import React, { useState, useEffect } from "react";
import Layout from "@/components/Layouts/Layout";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { singleStoreSelector } from "@/store/slices/storeSlice";
import { fetchProductsByStore, productSelector } from "@/store/slices/shopSlice";
import Image from "next/image";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { requestAllStores, requestStoreById } from "@/services/storeService";
import { requestProductsByStore } from "@/services/shopService";
import ErrorBoundary from "@/components/Error/ErrorBoundary";
import { Context } from "vm";
import { setAuthHeaders } from "@/utils/httpClient";
import protectedRoute from "@/components/protectedRoute";

interface IParams extends ParsedUrlQuery {
  id: string;
}

interface SingleStoreProps {
  initialStore?: {
    id: string;
    name: string;
    description: string;
    imgUrl: string;
    categoryId: string;
    metaTitle?: string;
    metaDescription?: string;
  };
  initialProducts?: Array<{
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
  const id = "c77b3af2-72fa-4d15-8e0f-96b88560c07a"

  const store = useSelector(singleStoreSelector) || initialStore;
  const products = useSelector(productSelector) || initialProducts;

  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    if (id && typeof id === "string") {
      dispatch(
        fetchProductsByStore({
          storeId: id,
          page: 1,
          pageSize: 20,
          searchQuery: sortBy,
        })
      );
    }
  }, [dispatch, id, sortBy]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

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
        <div className="store-header relative h-64 flex items-center justify-center overflow-hidden">
          <Image
            src={store.imgUrl}
            alt={store.name}
            fill
            priority
            className="object-cover opacity-70"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute text-center text-white px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{store.name}</h1>
            <p className="text-lg md:text-xl mb-4">{store.description}</p>
            <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
              {store.categoryId}
            </span>
          </div>
        </div>

        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Our Products</h2>
            <select
              className="w-full md:w-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {product.photos?.[0]?.imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL_Images}${product.photos[0].imageUrl}`}
                      alt={product.name ?? ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-blue-600 mb-2">
                    ${product.price?.toFixed(2)}
                  </p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < (product.ratings || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </ErrorBoundary>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await requestAllStores(); // Fetch the data
    const stores = response?.stores; // Access the `stores` property

    if (!Array.isArray(stores) || stores.length === 0) {
      console.warn("No stores found in API response");
      return { paths: [], fallback: "blocking" };
    }

    // Generate paths dynamically based on store IDs
    const paths = stores
      .filter((store: any) => store && store.id) // Filter out invalid stores
      .map((store: any) => ({
        params: { id: store.id.toString() }, // Ensure `id` is passed as a string
      }));

    console.log("Generated Paths:", paths); // Log the paths array for debugging
    return { paths, fallback: "blocking" }; // Use blocking fallback
  } catch (error) {
    console.error("Error generating static paths:", error);
    return { paths: [], fallback: "blocking" }; // Return empty paths if there's an error
  }
};

export const getStaticProps: GetStaticProps<SingleStoreProps> = async (context) => {
  const { id } = context.params as IParams; // Use `context.params.id`

  try {
    const [store, products] = await Promise.all([
      requestStoreById("c77b3af2-72fa-4d15-8e0f-96b88560c07a"),
      requestProductsByStore("c77b3af2-72fa-4d15-8e0f-96b88560c07a", 1, 20),
    ]);

    if (!store) {
      return { notFound: true }; // Return 404 if store is not found
    }

    return {
      props: {
        initialStore: store,
        initialProducts: products,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error(`Error fetching data for store ${id}:`, error);
    return { notFound: true }; // Return 404 on error
  }
};

// export async function generateMetadata({ params }: { params: { id: string } }, context: any) {
//   try {
//       const headers = context.req.headers;

  
//   setAuthHeaders(headers);
  
//     const store = await requestStoreById(params.id);

//     if (!store) {
//       return {
//         title: "Store Not Found",
//         description: "The requested store could not be found.",
//       };
//     }

//     return {
//       title: store?.metaTitle || store?.name || "Store Page",
//       description: store?.metaDescription || store?.description || "Discover our products",
//       openGraph: {
//         title: store?.metaTitle || store?.name || "Store Page",
//         description: store?.metaDescription || store?.description || "Discover our products",
//         images: [{ url: store?.imgUrl || "/default-store-image.jpg" }],
//         url: `${process.env.NEXT_PUBLIC_BASE_URL}/stores/${params.id}`,
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: store?.metaTitle || store?.name || "Store Page",
//         description: store?.metaDescription || store?.description || "Discover our products",
//         image: store?.imgUrl || "/default-store-image.jpg",
//       },
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/stores/${params.id}`,
//       },
//     };
//   } catch (error) {
//     console.error("Error generating metadata:", error);
//     return {
//       title: "Store Page",
//       description: "Discover our wide range of products",
//     };
//   }
// }

export default protectedRoute(SingleStore);