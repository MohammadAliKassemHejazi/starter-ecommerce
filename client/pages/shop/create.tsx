import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { IProductModel, IProductModelErrors } from "../../src/models/product.model";
import { useAppDispatch } from "@/store/store";
import { createProduct } from "@/store/slices/shopSlice";
import ImageUploadComponent from "@/components/UI/ImageUploadComponent/ImageUploadComponent";
import ImageViewer from "../../src/components/UI/imageViewer/imageViewer";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { ImageListType } from "react-images-uploading";
import Layout from "@/components/Layouts/Layout";

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

  const [product, setProduct] = useState<IProductModel>({
    name: "",
    description: "",
    price: 0,
    photos: [], 
    croppedPhotos: [], 
  });
  const initialValues: IProductModel = {
    name: "",
    description: "",
    price: 0,
    photos: [],
    croppedPhotos: [],
  };

  const handlePhotoChange = (croppedImages: ImageListType) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      croppedPhotos: croppedImages,
    }));
  };
  

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

    product.croppedPhotos.forEach((file, index) => {
      if (file && file.file instanceof File) {
        formData.append(`photos`, file.file, file.file.name);
      }
    });

    try {
      const response = await dispatch(createProduct(formData)).unwrap();
      router.push(`/shop/${response.id}`);
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
              <button type="submit" disabled={isSubmitting}>
                Create Product
              </button>
            </Form>
          )}
        </Formik>

        <ImageUploadComponent onImagesChange={handlePhotoChange} defaultImages={product.photos} />

        <div>
          <h3>Cropped Images</h3>
          <ImageViewer croppedPhotos={product.croppedPhotos} />
        </div>
      </section>
    </Layout>
  );
}

export default CreateProduct;

