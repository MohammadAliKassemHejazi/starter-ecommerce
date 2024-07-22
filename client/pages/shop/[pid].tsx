import Layout from '@/components/Layouts/Layout';
import MySwiperComponent from '@/components/UI/ImagesSlider/MySwiperComponent';
import { useRouter } from 'next/router';
import React from 'react';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { Formik, Form } from 'formik';
import { IProductModel } from "../../src/models/product.model"; // Adjust the import path as needed
import httpClient from '@/utils/httpClient';

const SingleItem: React.FC<{ product: IProductModel }> = ({ product }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (values: any) => {
    console.log('Form values', values);
  };

  return (
    <Layout>
      <section className="bg-light">
        <div className="container pb-5">
          <div className="row">
            <div className="col-lg-5 mt-5">
              <div className="card mb-3">
                <Image
                  className="card-img img-fluid"
                  src={product?.croppedPhotos?.[0]?.dataURL ?? ""}
                  alt={product?.name??""}
                  height={350}
                  width={300}
                />
              </div>
              <div className="row">
                <MySwiperComponent imageLinks={product?.photos?.map((photo: any) => photo.dataURL)??[]} />
              </div>
            </div>
            <div className="col-lg-7 mt-5">
              <div className="card">
                <div className="card-body">
                  <h1 className="h2">{product?.name??""}</h1>
                  <p className="h3 py-2">${product?.price?.toFixed(2)}</p>
                  <p className="py-2">
                    <i className="fa fa-star text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                    <i className="fa fa-star text-secondary"></i>
                    <span className="list-inline-item text-dark">
                      Rating {product?.rating ?? ""} | {product?.commentsCount ?? ""} Comments
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
                  <p>{product?.description??""}</p>

                  <Formik
                    initialValues={{
                      size: 'S',
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
                              {product.sizes?.map((s) => (
                                <li
                                  key={s.id}
                                  className="list-inline-item"
                                >
                                  <span
                                    className={`btn btn-success btn-size ${
                                      values.size === s.size ? 'active' : ''
                                    }`}
                                    onClick={() => setFieldValue('size', s.size)}
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
                                  onClick={() => setFieldValue('quantity', Math.max(values.quantity - 1, 1))}
                                >
                                  -
                                </span>
                              </li>
                              <li className="list-inline-item">
                                <span className="badge bg-secondary">{values.quantity}</span>
                              </li>
                              <li className="list-inline-item">
                                <span
                                  className="btn btn-success"
                                  onClick={() => setFieldValue('quantity', values.quantity + 1)}
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
                  {product.comments?.map((comment: any, index: any) => (
                    <div key={index} className="comment">
                      <p><strong>{comment.user}</strong></p>
                      <p>{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pid } = context.params!;

  try {
    // Fetch the product data from the API using the `pid`
    const response = await httpClient.get(`/shop/get?id=${pid}`);
    console.log(response)
    if (!response.data) {
      return { notFound: true };
    }
    
    // Extract and ensure the product data is serializable
    const product = response.data;

    return {
      props: {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          rating: product.rating,
          commentsCount: product.commentsCount,
          croppedPhotos: product.croppedPhotos,
          photos: product.photos,
          sizes: product.sizes,
          store: product.store,
          description: product.description,
          comments: product.comments,
        },
      },
    };
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return { notFound: true };
  }
};

export default SingleItem;
