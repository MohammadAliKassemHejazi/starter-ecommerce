
import { useSelector } from "react-redux";
import React, { useCallback, useState, useEffect } from "react";
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
import ProtectedRoute from "@/components/protectedRoute";
import useRunOnce from "../../src/hooks/useRunOnce";
import { getUserPackageLimits } from "@/services/packageService";
import { PackageLimits } from "@/components/Package/PackageLimits";
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
  const [packageLimits, setPackageLimits] = useState<any>(null);
  const [canCreateStore, setCanCreateStore] = useState(false);

  useRunOnce(() => {
    dispatch(fetchAllCategories());
  });

  useEffect(() => {
    loadPackageLimits();
  }, []);

  const loadPackageLimits = async () => {
    try {
      const limits = await getUserPackageLimits();
      setPackageLimits(limits);
      setCanCreateStore(limits.canCreateStore);
    } catch (error) {
      console.error('Error loading package limits:', error);
    }
  };

  const [store, setStore] = useState<IStoreModel>({
    name: "",
    description: "",
    categoryId: "",
    photos: [],
    croppedImages: [],
  });

  const initialValues: IStoreModel = {
    name: "",
    description: "",
    categoryId: "",
    photos: [],
    croppedImages: [],
  };

  const handlePhotoChange = useCallback((croppedImages: ImageListType) => {
    if (croppedImages.length > 1) {
      Toast.fire({
        icon: "error",
        title: `you can only upload one image`,
      });
      return
    }
    setStore((prevStore) => ({
      ...prevStore,
      croppedImages: croppedImages,
    }));
  }, []);

  const handleSubmit = async (values: IStoreModel) => {
    if (!canCreateStore) {
      Toast.fire({
        icon: "error",
        title: "You have reached your store creation limit. Please upgrade your package.",
      });
      return;
    }

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
      
      // Reload package limits after successful creation
      loadPackageLimits();
    } catch (error: any) {
      Toast.fire({
        icon: "error",
        title: `Failed to create store: ${error.message}`,
      });
    }
  };

  const handleDeleteImage = async (index: number) => {
  if (!store?.croppedImages || !store?.photos) {
    console.error("ProductImages or photos is undefined or null.");
    return;
  }
  
 const newProductImages = store.croppedImages!.filter((_, i) => i !== index)
    const newphotos= store.photos!.filter((_, i) => i !== index)
  // Remove the image from both ProductImages and photos
  setStore((prevProduct) => ({
    ...prevProduct,
    ProductImages: newProductImages,
    photos: newphotos,
  }));
  handlePhotoChange(newProductImages);
};

  if (!canCreateStore && packageLimits) {
    return (
      <Layout>
        <section className="mt-5">
          <div className="container">
            <h2 className="text-center mb-4">Create Store</h2>
            <div className="alert alert-warning">
              <h4>Store Creation Limit Reached</h4>
              <p>You have reached your store creation limit ({packageLimits.currentStoreCount}/{packageLimits.storeLimit}).</p>
              <p>Please upgrade your package to create more stores.</p>
            </div>
            <PackageLimits />
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="mt-5">
        <div className="container">
          <h2 className="text-center mb-4">Create Store</h2>
          
          {/* Package Limits Display */}
          <div className="mb-4">
            <PackageLimits />
          </div>
          
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
                      
                  <ImageViewer
                    productImages={store.croppedImages ?? []}
                    isonline={false}
                    onDeleteImage={handleDeleteImage}
                  />
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

export default function ProtectedCreateStore() {
  return (
    <ProtectedRoute>
      <CreateStore />
    </ProtectedRoute>
  );
}
