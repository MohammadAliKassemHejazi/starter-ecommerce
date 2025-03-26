import { useSelector } from "react-redux";
import React, { useCallback, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { IStoreModel, IStoreModelErrors, IStoreResponseModel } from "../../src/models/store.model";
import { useAppDispatch } from "@/store/store";
import { 
  fetchStoreById, 
  updateStore, 
  deleteStoreImage 
} from "@/store/slices/storeSlice";
import ImageUploadComponent from "@/components/UI/General/ImageUploadComponent/ImageUploadComponent";
import ImageViewer from "../../src/components/UI/General/imageViewer/imageViewer";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { ImageListType } from "react-images-uploading";
import Layout from "@/components/Layouts/Layout";
import { utileCategoriesSelector, fetchAllCategories } from "@/store/slices/utilsSlice";
import protectedRoute from "@/components/protectedRoute";

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

const EditStore = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = router.query; // Get store ID from URL
  const categoriesList = useSelector(utileCategoriesSelector);
 const [store, setStore] = useState<IStoreModel | null>(null);

  // Fetch store data on component mount
useEffect(() => {
  if (id) {
    dispatch(fetchStoreById(id as string))
      .unwrap()
        .then((store: IStoreResponseModel) => {
          debugger
        // Map backend image to ImageListType format
        const formattedImages: ImageListType = store.imgUrl
          ? [{
              id: store.id,
              data_url: store.imgUrl, // Use backend URL
              file: undefined, // Must be `undefined`, NOT `null`
            }]
          : [];

        setStore({
          ...store,
          categoryId: Number(store.categoryId), // Convert string to number if needed
          croppedImages: formattedImages,
          photos: [], // Initialize photos as empty (for new uploads)
        });
      })
      .catch((error) => {
        Toast.fire({ icon: "error", title: `Failed to fetch store: ${error.message}` });
      });
  }
}, [id, dispatch]);

  // Fetch categories for the dropdown
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // Handle image changes (cropping/uploading)
const handlePhotoChange = useCallback((croppedImages: ImageListType) => {
  setStore((prevStore) => ({
    ...prevStore!,
    croppedImages: croppedImages.map((img) => ({
      ...img,
      file: img.file || undefined, // Normalize null to undefined
    })),
  }));
}, []);

  // Handle image deletion (similar to EditProduct)
const handleDeleteImage = async (index: number) => {
  if (!store?.croppedImages) {return;}

  const imageToDelete = store.croppedImages[index];
  const isOnline = !!imageToDelete.id; // Check if image is already uploaded

  try {
    if (isOnline) {
      await dispatch(deleteStoreImage(imageToDelete.id!)).unwrap();
    }

    // Remove the image from croppedImages (maintain type safety)
    setStore((prevStore) => ({
      ...prevStore!,
      croppedImages: prevStore!.croppedImages.filter((_, i) => i !== index),
    }));

    Toast.fire({ icon: "success", title: "Image deleted successfully" });
  } catch (error: any) {
    Toast.fire({ icon: "error", title: `Failed to delete image: ${error.message}` });
  }
};

  // Handle form submission
  const handleSubmit = async (values: IStoreModel) => {
    if (!store) {return;}

    const formData = new FormData();
    formData.append("storeId", id as string); // Include store ID for updates

    // Append form fields
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "photos" && key !== "croppedImages") {
        formData.append(key, typeof value === "boolean" ? value.toString() : value);
      }
    });

    // Append new images (only those with a File object)
    store.croppedImages.forEach((image) => {
      if (image.file instanceof File) {
        formData.append("photos", image.file, image.file.name);
      }
    });

    try {
      await dispatch(updateStore(formData)).unwrap();
      Toast.fire({
        icon: "success",
        title: "Store updated successfully",
      });
      router.push(`/store/${id}`);
    } catch (error: any) {
      Toast.fire({
        icon: "error",
        title: `Failed to update store: ${error.message}`,
      });
    }
  };

  if (!store) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <section className="mt-5">
        <div className="container">
          <h2 className="text-center mb-4">Edit Store</h2>
          <Formik
            initialValues={store} // Initialize with fetched store data
            onSubmit={handleSubmit}
            enableReinitialize // Allow form to update when store changes
            validate={(values) => {
              const errors: Partial<IStoreModelErrors> = {};
              if (!values.name) {errors.name = "Required";}
              return errors;
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
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
                      defaultImages={store.croppedImages} // Existing images (from backend)
                    />
                    <h3 className="mt-4">Cropped Images</h3>
                    <ImageViewer
                      productImages={store.croppedImages}
                      isonline={true} // Assume images are online if they have an ID
                      onDeleteImage={handleDeleteImage}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg" 
                  disabled={isSubmitting}
                >
                  Update Store
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </Layout>
  );
};

export default protectedRoute(EditStore);