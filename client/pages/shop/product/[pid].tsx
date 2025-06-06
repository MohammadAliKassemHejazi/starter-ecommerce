import React, { useState } from "react";
import Layout from "@/components/Layouts/Layout";
import MySwiperComponent from "@/components/UI/General/ImagesSlider/MySwiperComponent";
import { useRouter } from "next/router";
import Image from "next/image";
import { Formik, Form, Field } from "formik";
import { IProductModel } from "../../../src/models/product.model"; // Adjust the import path as needed
import {
  requestAllProductID,
  requestProductById,
} from "@/services/shopService";
import Head from "next/head";
import protectedRoute from "@/components/protectedRoute";
import { useAppDispatch } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";
import Swal from "sweetalert2";
import { GetStaticPaths, GetStaticProps } from "next";
import styles from "./SingleItem.module.css";
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
    <Layout>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <div className={styles.productContainer}>
        {/* Image Slider */}
        <div className={styles.productImages}>
          {/* Large Image on Top */}

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
      

        {/* Product Details */}
        <div className={styles.productDetails}>
          <h1 className={styles.productName}>{product?.name}</h1>
       <div className={styles.productPrice}>
  {/* Original Price */}
  <span
    className={`${product?.discount ? styles.discountPrice : styles.originalPrice}`}
  >
    ${product?.price?.toFixed(2)}
  </span>

  {/* Discounted Price */}
  {product?.discount && (
    <span className={styles.originalPrice}>
      $
      {(
        product.price! -
        (product.price! * product.discount) / 100
      ).toFixed(2)}
    </span>
  )}
</div>
          <p className={styles.productDescription}>{product?.description}</p>

          {/* Add to Cart Form */}

<Formik
  initialValues={{
    size: "", // Default size
    sizeId: "", // Default size ID
    quantity: 1, // Set default quantity to 1
  }}
  onSubmit={(values) => {
    console.log(values);
    handleAddToCart(product!, values.size, values.sizeId, values.quantity);
  }}
  validate={(values) => {
    const errors: any = {};
    if (!values.sizeId) {
      errors.sizeId = "Please select a size";
    }

    // Find the selected size's stock quantity
    const selectedSize = product?.SizeItems?.find(
      (size) => size.id === values.sizeId
    );
    const availableStock = selectedSize?.quantity || 0;

    if (values.quantity < 1) {
      errors.quantity = "Quantity must be at least 1";
    } else if (values.quantity > availableStock) {
      errors.quantity = `Quantity cannot exceed available stock (${availableStock})`;
    }

    return errors;
  }}
>
  {({ errors, touched, values, setFieldValue }) => (
    <Form className={styles.cartForm}>
      {/* Quantity Field */}
      <div className={styles.formField}>
        <label className={styles.formLabel}>Quantity</label>
        <Field
          className={`${styles.formInput} ${
            errors.quantity && touched.quantity ? styles.inputError : ""
          }`}
          type="number"
          name="quantity"
          min={1}
          max={
            product?.SizeItems?.find((size) => size.id === values.sizeId)
              ?.quantity || 1
          } // Dynamically set max attribute based on stock
        />
        {errors.quantity && touched.quantity && (
          <div className={styles.errorMsg}>{errors.quantity}</div>
        )}
      </div>

      {/* Size Selection */}
      <div className={styles.formField}>
        <label className={styles.formLabel}>Size</label>
        <div className={styles.sizeOptions}>
          {product?.SizeItems?.map((size) => (
            <div key={size.id} className="position-relative">
              <Field
                className={`${styles.sizeOption} ${
                  touched.sizeId && errors.sizeId ? styles.error : ""
                }`}
                type="radio"
                name="sizeId"
                value={size.id}
                onClick={() => {
                  setFieldValue("size", size.Size?.size); // Update size field
                  setFieldValue("quantity", 1); // Reset quantity when size changes
                }}
              />
              <span className={`${styles.sizeMark}`}>
                {size.Size?.size} 
              </span>
            </div>
          ))}
        </div>
        {errors.sizeId && touched.sizeId && (
          <div className={styles.errorMsg}>{errors.sizeId}</div>
        )}
      </div>

      {/* Hidden input to submit size text */}
      <input type="hidden" name="size" value={values.size} />

      {/* Submit Button */}
      <button
        type="submit"
        className={styles.addToCartBtn}
        name="submit"
        value="addtocart"
      >
        Add To Cart
      </button>
    </Form>
  )}
</Formik>


          {/* Feedback Section */}
          <div className={styles.feedbackSection}>
            <h3 className={styles.feedbackTitle}>Leave Feedback</h3>
            <div className={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`
                    ${styles.star}
                    ${i < feedback.rating ? styles.filled : ""}
                  `}
                  onClick={() => setFeedback({ ...feedback, rating: i + 1 })}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              className={styles.feedbackInput}
              value={feedback.comment}
              onChange={(e) =>
                setFeedback({ ...feedback, comment: e.target.value })
              }
              placeholder="Your comment..."
            />
            <button
              className={styles.submitFeedback}
              onClick={() => {
                // Submit feedback logic
              }}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default protectedRoute(SingleItem);

// Fetch all product IDs at build time
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await requestAllProductID(); // Fetch all product IDs
    console.log(res, "response to requestAllProductID");
    if (!res || !Array.isArray(res.message)) {
      console.error("Invalid response structure:", res);
      return { paths: [], fallback: "blocking" };
    }

    // Pre-render only the first 50 products (adjust as needed)
    const paths = res.message.map((product: any) => ({
      params: { pid: product.id.toString() },
    }));
    console.log(paths, "paths res.message");
    return {
      paths, // Pre-rendered pages for first 50 products
      fallback: "blocking", // Other pages will be generated on-demand
    };
  } catch (error) {
    console.error("Error fetching product IDs:", error);
    return { paths: [], fallback: "blocking" };
  }
};

// Fetch product data at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { pid } = params as { pid: string };

  console.log("Fetching data for ID:", pid);

  try {
    const product = await requestProductById(pid);

    if (!product) {
      return { notFound: true };
    }

    return {
      props: { product },
      revalidate: 3600, // Revalidate every hour (ISR)
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { notFound: true };
  }
};

// Generate metadata for each product page
export async function generateMetadata({
  params,
}: {
  params: { pid: string };
}) {
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
