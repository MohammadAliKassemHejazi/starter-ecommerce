import React, { useState } from "react";
import Layout from "@/components/Layouts/Layout";
import MySwiperComponent from "@/components/UI/General/ImagesSlider/MySwiperComponent";
import { useRouter } from "next/router";
import Image from "next/image";
import { Formik, Form } from "formik";
import { IProductModel } from "../../../src/models/product.model"; // Adjust the import path as needed
import { setAuthHeaders } from "@/utils/httpClient";
import { requestProductById } from "@/services/shopService";
import Head from "next/head";
import protectedRoute from "@/components/protectedRoute";
import { useAppDispatch } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";
import Swal from "sweetalert2";
import { GetStaticPaths, GetStaticProps } from "next";

type Props = {
  product?: IProductModel;
};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const SingleItem = ({ product }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: "",
  });

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product?.name ?? "",
    description: product?.description ?? "",
    sku: product?.id ?? "",
    brand: {
      "@type": "Brand",
      name: product?.store?.name ?? "",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product?.price ?? 0,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
    },
    image:
      process.env.NEXT_PUBLIC_BASE_URL_Images +
      (product?.ProductImages?.[0]?.imageUrl ?? ""),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product?.ratings ?? 0,
      reviewCount: product?.commentsCount ?? 0,
    },
  };

  const handleAddToCart = (
    product: IProductModel,
    size: string,
    sizeId: string,
    quantity: number
  ) => {
    if (!size || !sizeId) {
      Toast.fire({
        icon: "error",
        title: "Please select a size",
      });
      return;
    }

    if (quantity <= 0) {
      Toast.fire({
        icon: "error",
        title: "Please select a valid quantity",
      });
      return;
    }

    product.quantity = quantity;
    const productWithSizeAndQuantity = {
      ...product,
      size,
      sizeId,
    };

    dispatch(addToCart(productWithSizeAndQuantity));
    Toast.fire({
      icon: "success",
      title: "Added to cart",
    });
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          id={product?.id ?? ""}
        />
      </Head>
      <Layout>
        <section className="bg-light">
          <div className="container pb-5">
            <div className="row">
              <div className="col-lg-5 mt-5">
                <div className="card mb-3">
                  <Image
                    className="card-img img-fluid"
                    src={
                      process.env.NEXT_PUBLIC_BASE_URL_Images +
                      (product?.ProductImages?.[0]?.imageUrl ?? "")
                    }
                    alt={product?.name ?? ""}
                    height={350}
                    width={300}
                    layout="responsive"
                    quality={75}
                  />
                </div>
                <div className="row">
                  <MySwiperComponent
                    imageLinks={
                      product?.ProductImages?.map(
                        (photo: any) =>
                          process.env.NEXT_PUBLIC_BASE_URL_Images +
                          photo.imageUrl
                      ) ?? []
                    }
                  />
                </div>
              </div>
              <div className="col-lg-7 mt-5">
                <div className="card">
                  <div className="card-body">
                    <h1 className="h2">{product?.name ?? ""}</h1>
                    <p className="h3 py-2">${product?.price?.toFixed(2)}</p>
                    <p className="py-2">
                      <i className="fa fa-star text-warning"></i>
                      <i className="fa fa-star text-warning"></i>
                      <i className="fa fa-star text-warning"></i>
                      <i className="fa fa-star text-warning"></i>
                      <i className="fa fa-star text-secondary"></i>
                      <span className="list-inline-item text-dark">
                        Rating {product?.ratings ?? ""} |{" "}
                        {product?.commentsCount ?? ""} Comments
                      </span>
                    </p>
                    <ul className="list-inline">
                      <li className="list-inline-item">
                        <h6>Brand:</h6>
                      </li>
                      <li className="list-inline-item">
                        <p className="text-muted">
                          <strong>{product?.store?.name ?? ""}</strong>
                        </p>
                      </li>
                    </ul>
                    <h6>Description:</h6>
                    <p>{product?.description ?? ""}</p>

                    <Formik
                      initialValues={{
                        size: "S", // Default size
                        sizeId: "", // Default size ID
                        quantity: 1,
                      }}
                      onSubmit={(values) => {
                        handleAddToCart(
                          product!,
                          values.size,
                          values.sizeId,
                          values.quantity
                        );
                      }}
                    >
                      {({ values, setFieldValue }) => (
                        <Form>
                          <div className="row">
                            <div className="col-auto">
                              <ul className="list-inline pb-3">
                                <li className="list-inline-item">
                                  Size:
                                  <input
                                    type="hidden"
                                    name="size"
                                    value={values.size}
                                  />
                                  <input
                                    type="hidden"
                                    name="sizeId"
                                    value={values.sizeId}
                                  />
                                </li>
                                {product?.SizeItems?.map((s) => {
                                  return (
                                    <li key={s.id} className="list-inline-item">
                                      <button
                                        type="button"
                                        className={`btn btn-success btn-size ${
                                          values.size === s.Size?.size
                                            ? "active"
                                            : ""
                                        }`}
                                        onClick={() => {
                                          setFieldValue("size", s.Size?.size);
                                          setFieldValue("sizeId", s.id);
                                        }}
                                        disabled={s.quantity === 0}
                                      >
                                        {s.Size?.size}
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <div className="col-auto">
                              <ul className="list-inline pb-3">
                                <li className="list-inline-item text-right">
                                  Quantity
                                  <input
                                    type="hidden"
                                    name="quantity"
                                    value={values.quantity}
                                  />
                                </li>
                                <li className="list-inline-item">
                                  <span
                                    className="btn btn-success"
                                    onClick={() =>
                                      setFieldValue(
                                        "quantity",
                                        Math.max(values.quantity - 1, 1)
                                      )
                                    }
                                  >
                                    -
                                  </span>
                                </li>
                                <li className="list-inline-item">
                                  <span className="badge bg-secondary">
                                    {values.quantity}
                                  </span>
                                </li>
                                <li className="list-inline-item">
                                  <span
                                    className="btn btn-success"
                                    onClick={() =>
                                      setFieldValue(
                                        "quantity",
                                        values.quantity + 1
                                      )
                                    }
                                  >
                                    +
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="row pb-3">
                            <div className="col d-grid">
                              <button
                                type="submit"
                                className="btn btn-success btn-lg"
                                name="submit"
                                value="addtocart"
                              >
                                Add To Cart
                              </button>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default protectedRoute(SingleItem);

// Fetch all product IDs at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  const products: IProductModel[] = await res.json();

  const paths = products.map((product) => ({
    params: { pid: product.id!.toString() },
  }));

  return {
    paths,
    fallback: "blocking", // Generate pages on-demand if not pre-rendered
  };
};

// Fetch product data at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { pid } = params as { pid: string };

  try {
    const product = await requestProductById(pid);

    if (!product) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        product,
      },
      revalidate: 60 * 60, // Revalidate every hour (ISR)
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      notFound: true,
    };
  }
};

// Generate metadata for each product page
export async function generateMetadata({ params }: { params: { pid: string } }) {
  const { pid } = params;
  const product = await requestProductById(pid);

  return {
    title: product?.metaTitle ?? product?.name ?? "Product Page",
    description:
      product?.metaDescription ?? product?.description ?? "Product Description",
    openGraph: {
      title: product?.metaTitle ?? product?.name ?? "Product Page",
      description:
        product?.metaDescription ??
        product?.description ??
        "Product Description",
      images: [
        {
          url:
            process.env.NEXT_PUBLIC_BASE_URL_Images +
            (product?.ProductImages?.[0]?.imageUrl ?? ""),
        },
      ],
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${pid}`,
    },
    twitter: {
      card: "summary_large_image",
      title: product?.metaTitle ?? product?.name ?? "Product Page",
      description:
        product?.metaDescription ??
        product?.description ??
        "Product Description",
      image:
        process.env.NEXT_PUBLIC_BASE_URL_Images +
        (product?.ProductImages?.[0]?.imageUrl ?? ""),
    },
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${pid}`,
  };
}