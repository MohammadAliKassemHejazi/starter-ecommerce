import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { IProductModel, IProductModelErrors } from "../../../src/models/product.model";
import { useAppDispatch } from "@/store/store";
import { updateProduct } from "@/store/slices/shopSlice";
import ImageUploadComponent from "@/components/UI/ImageUploadComponent/ImageUploadComponent";
import ImageViewer from "../../../src/components/UI/imageViewer/imageViewer";

import Swal from "sweetalert2";
import { ImageListType } from "react-images-uploading";
import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { setAuthHeaders } from "@/utils/httpClient";

import { requestProductById } from "@/services/shopService";

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

type EditProductProps = {
  product?: IProductModel;
};

const EditshopItem = ({ product }: EditProductProps) => {

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const [updatedProduct, setUpdatedProduct] = useState<IProductModel>({
    ...product!,
    croppedPhotos: product?.photos || [],
  });

  useEffect(() => {
    if (product) {
      setUpdatedProduct({
        ...product,
        croppedPhotos: product.photos || [],
      });
    }
  }, [product]);

  const initialValues: IProductModel = {
    ...product!,
  };

  const handlePhotoChange = (croppedImages: ImageListType) => {
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      croppedPhotos: croppedImages,
    }));
  };

  const handleSubmit = async (values: IProductModel) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "photos") {
        formData.append(
          key,
          typeof value === "boolean" ? value.toString() : value
        );
      }
    });

    formData.append("id", (product!.id ?? 0).toString());

    updatedProduct.croppedPhotos?.forEach((file) => {
      if (file && file.file instanceof File) {
        formData.append(`photos`, file.file, file.file.name);
      }
    });

    try {
      await dispatch(updateProduct(formData)).unwrap();

      Toast.fire({
        icon: "success",
        title: "Product updated successfully",
      });
    } catch (error: any) {
      Toast.fire({
        icon: "error",
        title: `Failed to update product: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section>
        <h2>Edit Product</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors: Partial<IProductModelErrors> = {};
            if (!values.name) {
              errors.name = "Required";
            }
            if (values.price && (values.price <= 0 || isNaN(values.price))) {
              errors.price = "Price must be a positive number";
            }
            return errors;
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="name">Name:</label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component="div" />
              </div>
              <div>
                <label htmlFor="description">Description:</label>
                <Field as="textarea" id="description" name="description" />
                <ErrorMessage name="description" component="div" />
              </div>
              <div>
                <label htmlFor="price">Price:</label>
                <Field type="number" id="price" name="price" />
                <ErrorMessage name="price" component="div" />
              </div>
              <div>
                <label htmlFor="isActive">Is Active:</label>
                <Field type="checkbox" id="isActive" name="isActive" />
              </div>
              <div>
                <label htmlFor="storeId">Store:</label>
                <Field as="select" id="storeId" name="storeId">
                  <option value="">Select Store</option>
                  <option value="1">Store 1</option>
                  <option value="2">Store 2</option>
                </Field>
                <ErrorMessage name="storeId" component="div" />
              </div>
              <div>
                <label htmlFor="subcategoryId">Subcategory:</label>
                <Field as="select" id="subcategoryId" name="subcategoryId">
                  <option value="">Select Subcategory</option>
                  <option value="1">Subcategory 1</option>
                  <option value="2">Subcategory 2</option>
                </Field>
                <ErrorMessage name="subcategoryId" component="div" />
              </div>
              <div>
                <label htmlFor="inventoryStatus">Inventory Status:</label>
                <Field as="select" id="inventoryStatus" name="inventoryStatus">
                  <option value="">Select Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </Field>
                <ErrorMessage name="inventoryStatus" component="div" />
              </div>
              <div>
                <label htmlFor="salePrice">Sale Price:</label>
                <Field type="number" id="salePrice" name="salePrice" />
                <ErrorMessage name="salePrice" component="div" />
              </div>
              <div>
                <label htmlFor="tags">Tags:</label>
                <Field type="text" id="tags" name="tags" />
                <ErrorMessage name="tags" component="div" />
              </div>
              <div>
                <label htmlFor="metaTitle">Meta Title:</label>
                <Field type="text" id="metaTitle" name="metaTitle" />
                <ErrorMessage name="metaTitle" component="div" />
              </div>
              <div>
                <label htmlFor="metaDescription">Meta Description:</label>
                <Field as="textarea" id="metaDescription" name="metaDescription" />
                <ErrorMessage name="metaDescription" component="div" />
              </div>
              <button type="submit" disabled={isSubmitting || loading}>
                {loading ? "Updating..." : "Update Product"}
              </button>
            </Form>
          )}
        </Formik>
        <ImageUploadComponent
          onImagesChange={handlePhotoChange}
          defaultImages={updatedProduct.photos}
        />
        <div>
          <h3>Cropped Images</h3>
          <ImageViewer croppedPhotos={updatedProduct.croppedPhotos ?? []} />
        </div>
      </section>
    </Layout>
  );
}

export default protectedRoute(EditshopItem);

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { pid }: any = context.query;
  const headers = context.req.headers;
  setAuthHeaders(headers);
  
  if (pid) {
    const article = await requestProductById(pid);
    return {
      props: {
        article,
      },
    };
  } else {
    return { props: {} };
  }
};