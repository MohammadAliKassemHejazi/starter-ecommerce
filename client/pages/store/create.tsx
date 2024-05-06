import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { IStoreModel, IStoreModelErrors } from "../../src/models/store.model";
import { useAppDispatch } from "@/store/store";
import { createStore } from "@/store/slices/storeSlice";
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

function CreateStore() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [store, setStore] = useState<IStoreModel>({
    name: "",
    description: "",
    categoryId : 0,
photos : [],
    croppedImages: [],
  });

  const initialValues: IStoreModel = {
    name: "",
    description: "",
    categoryId : 0,
      photos: [],
      croppedImages: [],
  };

  const handlePhotoChange = (croppedImages: ImageListType) => {
    setStore((prevStore) => ({
      ...prevStore,
      croppedImages: croppedImages,
    }));
  };

  const handleSubmit = async (values: IStoreModel) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key !== "photos") {
        formData.append(
          key,
          typeof value === "boolean" ? value.toString() : value
        );
      }
    });

    store.croppedImages.forEach((file, index) => {
      if (file && file.file instanceof File) {
        formData.append(`photos`, file.file, file.file.name);
      }
    });

    try {
      const response = await dispatch(createStore(formData)).unwrap();
      router.push(`/shop/${response.id}`);
      Toast.fire({
        icon: "success",
        title: "Store created successfully",
      });
    } catch (error: any) {
      Toast.fire({
        icon: "error",
        title: `Failed to create store: ${error.message}`,
      });
    }
  };

  return (
    <Layout >
      <section className="mt-5">
        <h2>Create Store</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors: Partial<IStoreModelErrors> = {};
            if (!values.name) {
              errors.name = "Required";
            }
            // Add other validation rules as needed
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
                <label htmlFor="categoryId">Subcategory:</label>
                <Field as="select" id="categoryId" name="categoryId">
                  <option value="">Select Subcategory</option>
                  <option value="1">Subcategory 1</option>
                  <option value="2">Subcategory 2</option>
                </Field>
                <ErrorMessage name="categoryId" component="div" />
              </div>

              <button type="submit" disabled={isSubmitting}>
                Create Store
              </button>
            </Form>
          )}
        </Formik>

        <ImageUploadComponent
          onImagesChange={handlePhotoChange}
          defaultImages={store.photos}
        />

        <div>
          <h3>Cropped Images</h3>
          <ImageViewer croppedPhotos={store.croppedImages} />
        </div>
      </section>
    </Layout>
  );
}

export default CreateStore;
