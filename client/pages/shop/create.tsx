import React, { useCallback, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { IProductModel, IProductModelErrors } from "../../src/models/product.model";
import { useAppDispatch,store } from "@/store/store";
import { createProduct } from "@/store/slices/shopSlice";
import ImageUploadComponent from "@/components/UI/ImageUploadComponent/ImageUploadComponent";
import ImageViewer from "../../src/components/UI/imageViewer/imageViewer";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { ImageListType } from "react-images-uploading";
import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";

import { fetchAllStores, storeSelector } from "@/store/slices/storeSlice";
import { fetchAllSubCategoriesID, utileSubCategoriesSelector } from "@/store/slices/utilsSlice";
import { useSelector } from "react-redux";

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

function CreateProduct() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Correctly using the selector to get single store data
  const listOfStores = useSelector(storeSelector);
  const listofsubCategories = useSelector(utileSubCategoriesSelector);
  React.useEffect(() => {
    store.dispatch(fetchAllStores());
  }, []);

  const handleStoreChange = (event: React.ChangeEvent<HTMLSelectElement>, setFieldValue: Function) => {
    const { value } = event.target;
    setFieldValue("storeId", value);
    const selectedStore = listOfStores?.find(store => store.id === value);
    if (selectedStore) {
      setFieldValue("categoryId", selectedStore.categoryId);
    }
    dispatch(fetchAllSubCategoriesID(value));
  };

  const [product, setProduct] = useState<IProductModel>({
    name: "",
    description: "",
    price: 0,
    isActive: false,
    subcategoryId: "",
    storeId: "",
    metaTitle: "",
    metaDescription: "",
    photos: [],
    croppedPhotos: [],
  });

  const initialValues: IProductModel = {
    name: "",
    description: "",
    price: 0,
    isActive: false,
    subcategoryId: "",
    storeId: "",
    categoryId: "",  // Added categoryId to initial values
    metaTitle: "",
    metaDescription: "",
    photos: [],
    croppedPhotos: [],
  };

  const handlePhotoChange = useCallback((croppedImages: ImageListType) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      croppedPhotos: croppedImages,
    }));
  }, []);

  const handleSubmit = async (values: IProductModel) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key !== "photos") {
        formData.append(
          key,
          typeof value === "boolean" ? value.toString() : value
        );
      }
    });

    product.croppedPhotos?.forEach((file) => {
      if (file && file.file instanceof File) {
        formData.append(`photos`, file.file, file.file.name);
      }
    });

    try {

      const response = await dispatch(createProduct(formData)).unwrap();


       router.push(`/shop/${response.product.id}`);

      Toast.fire({
        icon: "success",
        title: "Product created successfully",
      });

    } catch (error: any) {

      Toast.fire({
        icon: "error",
        title: `Failed to create product: ${error.message}`,
      });

    }
  };

  return (
    <Layout>
      <section>
        <h2>Create Product</h2>
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
          {({ isSubmitting, setFieldValue }) => (
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
              {listOfStores ? (
                <div>
                  <label htmlFor="storeId">Store:</label>
                  <Field
                    as="select"
                    id="storeId"
                    name="storeId"
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleStoreChange(event, setFieldValue)}
                  >
                    <option value="">Select store</option>
                    {listOfStores?.map((store) => {
                      return (
                        <option key={store.id} value={store.id}>
                          {store.name}
                        </option>
                      );
                    })}
                  </Field>
                  <ErrorMessage name="storeId" component="div" />
                  <Field type="hidden" id="categoryId" name="categoryId" />
                </div>
              ) : (
                "Loading store data..."
              )}

              {listofsubCategories ? (
                <div>
                  <label htmlFor="subcategoryId">Subcategory:</label>
                  <Field as="select" id="subcategoryId" name="subcategoryId">
                    <option value="">Select subcategory</option>
                    {listofsubCategories?.map((subCategorie) => {
                      return (
                        <option key={subCategorie.id} value={subCategorie.id}>
                          {subCategorie.name}
                        </option>
                      );
                    })}
                  </Field>
                  <ErrorMessage name="subcategoryId" component="div" />
                </div>
              ) : (
                "Loading subCategories data..."
              )}

              <div>
                <label htmlFor="Discount">Sale Discount:</label>
                <Field type="number" id="Discount" name="Discount" />
                <ErrorMessage name="Discount" component="div" />
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
                <Field
                  as="textarea"
                  id="metaDescription"
                  name="metaDescription"
                />
                <ErrorMessage name="metaDescription" component="div" />
              </div>

              <button type="submit" disabled={isSubmitting}>
                Create Product
              </button>
            </Form>
          )}
        </Formik>

        <ImageUploadComponent
          onImagesChange={handlePhotoChange}
          defaultImages={product.photos}
        />

        <div>
          <h3>Cropped Images</h3>
          <ImageViewer croppedPhotos={product.croppedPhotos ?? []} />
        </div>
      </section>
    </Layout>
  );
}

export default protectedRoute(CreateProduct);
