import Layout from "@/components/Layouts/Layout";
import MySwiperComponent from "@/components/UI/ImagesSlider/MySwiperComponent";
import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Formik, Form } from "formik";
import { IProductModel } from "../../src/models/product.model"; // Adjust the import path as needed
import { setAuthHeaders } from "@/utils/httpClient";

import { requestProductById } from "@/services/shopService";
import Head from "next/head";

type Props = {
  product?: IProductModel;
};

const SingleItem = ({ product }: Props) => {
  const router = useRouter();
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
      (product?.croppedPhotos?.[0]?.dataURL ?? ""),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product?.rating ?? 0,
      reviewCount: product?.commentsCount ?? 0,
    },
  };
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (values: any) => {
    console.log("Form values", values);
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
                      (product?.croppedPhotos?.[0]?.dataURL ?? "")
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
                      product?.photos?.map(
                        (photo: any) =>
                          process.env.NEXT_PUBLIC_BASE_URL_Images +
                          photo.dataURL
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
                        Rating {product?.rating ?? ""} |{" "}
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
                        size: "S",
                        quantity: 1,
                      }}
                      onSubmit={handleSubmit}
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
                                </li>
                                {product?.sizes?.map((s) => (
                                  <li key={s.id} className="list-inline-item">
                                    <span
                                      className={`btn btn-success btn-size ${
                                        values.size === s.size ? "active" : ""
                                      }`}
                                      onClick={() =>
                                        setFieldValue("size", s.size)
                                      }
                                    >
                                      {s.size}
                                    </span>
                                  </li>
                                ))}
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
                                value="buy"
                              >
                                Buy
                              </button>
                            </div>
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
                    <h6>Comments:</h6>
                    {product?.comments?.map((comment: any, index: any) => (
                      <div key={index} className="comment">
                        <p>
                          <strong>{comment?.user ?? ""}</strong>
                        </p>
                        <p>{comment?.text ?? ""}</p>
                      </div>
                    ))}
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

export default SingleItem;

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
            (product?.croppedPhotos?.[0]?.dataURL ?? ""),
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
        (product?.croppedPhotos?.[0]?.dataURL ?? ""),
    },
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${pid}`,
  };
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { pid }: any = context.query;
  const headers = context.req.headers;

  try {
    setAuthHeaders(headers);

    if (pid) {
      const { product1 } = await requestProductById(pid);

      const product = {
        id: pid,
        name: "Sample Product",
        description: "This is a sample product description.",
        price: 29.99,
        stockQuantity: 100,
        isActive: true,
        ownerId: "sample-owner-id",
        categoryId: "sample-category-id",
        subcategoryId: "sample-subcategory-id",
        storeId: "sample-store-id",
        metaTitle: "Sample Meta Title",
        metaDescription: "Sample Meta Description",
        slug: "sample-product-slug",
        tags: "sample,product,tags",
        discount: 10,
        rating: 4.5,
        commentsCount: 10,
        comments: [
          { user: "User1", text: "Great product!" },
          { user: "User2", text: "Very useful." },
        ],
        croppedPhotos: [{ dataURL: "/compressed/40767-coding-event.avif" }],
        photos: [{ dataURL: "/compressed/40767-coding-event.avif" }],
        sizes: [
          { id: "size1", size: "S" },
          { id: "size2", size: "M" },
          { id: "size3", size: "L" },
        ],
        store: {
          name: "Sample Store",
        },
      };

      if (!product) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          product,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      notFound: true,
    };
  }
};
