
import { useSelector } from "react-redux";
import React, { useCallback, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { IStoreModel, IStoreModelErrors } from "../../src/models/store.model";
import { useAppDispatch } from "@/store/store";
import { createStore } from "@/store/slices/storeSlice";
import ImageUploadComponent from "@/components/UI/General/ImageUploadComponent/ImageUploadComponent";
import ImageViewer from "../../src/components/UI/General/imageViewer/imageViewer";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { ImageListType } from "react-images-uploading";
import Layout from "@/components/Layouts/Layout";
import { utileCategoriesSelector, fetchAllCategories } from "@/store/slices/utilsSlice";
import protectedRoute from "@/components/protectedRoute";
import useRunOnce from "../../src/hooks/useRunOnce";
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

const CreateStore = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const categoriesList = useSelector(utileCategoriesSelector);


  useRunOnce(() => {

    dispatch(fetchAllCategories());
   
  });

  const [store, setStore] = useState<IStoreModel>({
    name: "",
    description: "",
    categoryId: 0,
    photos: [],
    croppedImages: [],
  });

  const initialValues: IStoreModel = {
    name: "",
    description: "",
    categoryId: 0,
    photos: [],
    croppedImages: [],
  };

  const handlePhotoChange = useCallback((croppedImages: ImageListType) => {
    setStore((prevStore) => ({
      ...prevStore,
      croppedImages: croppedImages,
    }));
  }, []);

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

    store.croppedImages.forEach((file) => {
      if (file && file.file instanceof File) {
        formData.append(`photos`, file.file, file.file.name);
      }
    });

    try {
      const response = await dispatch(createStore(formData)).unwrap();
     
      router.push(`/store/${response.id}`);
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
    <Layout>
      <section className="mt-5">
        <div className="container">
          <h2 className="text-center mb-4">Create Store</h2>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validate={(values) => {
              const errors: Partial<IStoreModelErrors> = {};
              if (!values.name) {
                errors.name = "Required";
              }
              return errors;
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                {/* Store Information Card */}
                <div className="card mb-4">
                  <div className="card-header">Store Information</div>
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="name">Name:</label>
                      <Field type="text" className="form-control" id="name" name="name" />
                      <ErrorMessage name="name" component="div" className="text-danger" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Description:</label>
                      <Field as="textarea" className="form-control" id="description" name="description" rows="4" />
                      <ErrorMessage name="description" component="div" className="text-danger" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="categoryId">Category:</label>
                      <Field as="select" className="form-control" id="categoryId" name="categoryId">
                        <option value="">Select Category</option>
                        {categoriesList?.map((category: any) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="categoryId" component="div" className="text-danger" />
                    </div>
                  </div>
                </div>

                {/* Image Upload and Viewer Section */}
                <div className="card mb-4">
                  <div className="card-header">Store Images</div>
                  <div className="card-body">
                    <ImageUploadComponent
                      onImagesChange={handlePhotoChange}
                      updatedPhotos={store.croppedImages}
                      defaultImages={store.photos}
                    />
                    <h3 className="mt-4">Cropped Images</h3>
                    <ImageViewer productImages={store.croppedImages} />
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                  Create Store
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </Layout>
  );
}

export default protectedRoute(CreateStore);
