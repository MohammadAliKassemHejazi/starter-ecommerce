import React, { useEffect, useState, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import {
  IProductModel,
  IProductModelErrors,
} from "../../../src/models/product.model";
import { useAppDispatch } from "@/store/store";
import { updateProduct, fetchProductById, deleteProductImage } from "@/store/slices/shopSlice";
import ImageUploadComponent from "@/components/UI/ImageUploadComponent/ImageUploadComponent";
import ImageViewer from "../../../src/components/UI/General/imageViewer/imageViewer";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { ImageListType } from "react-images-uploading";
import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import { fetchAllStores, storeSelector } from "@/store/slices/storeSlice";
import {
  fetchAllSizes,
  fetchAllSubCategoriesID,
  utileSizes,
  utileSubCategoriesSelector,
} from "@/store/slices/utilsSlice";
import { ISize } from "@/models/size.model";
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

function EditProduct() {
  const isonline = true
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();

  const listOfStores = useSelector(storeSelector);
  const listOfSubCategories = useSelector(utileSubCategoriesSelector);
  const listOfSizes = useSelector(utileSizes);
  const [product, setProduct] = useState<IProductModel | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id as string))
        .unwrap()
        .then((fetchedProduct: IProductModel | any) => {
  
          setProduct(fetchedProduct);
          dispatch(fetchAllSubCategoriesID(fetchedProduct.categoryId ?? ""));
        })
        .catch((error) => {
          Toast.fire({
            icon: "error",
            title: `Failed to fetch product: ${error.message}`,
          });
        });
    }
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(fetchAllStores());
    dispatch(fetchAllSizes());
  }, [dispatch]);

  const handleStoreChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: Function
  ) => {
    const selectedStoreId = event.target.value;
    const selectedStore = listOfStores?.find(
      (store) => store.id === selectedStoreId
    );
    const categoryId = selectedStore ? selectedStore.categoryId : "";

    setFieldValue("storeId", selectedStoreId);
    setFieldValue("categoryId", categoryId);

    dispatch(fetchAllSubCategoriesID(categoryId));
  };

const handlePhotoChange = useCallback((croppedImages: ImageListType) => {
  setProduct((prevProduct) => {
    // Merge new cropped images with existing ProductImages
    const updatedImages = [
      ...(prevProduct?.ProductImages || []),
      ...croppedImages.map(image => ({
        imageUrl: image.dataURL, // Assuming `dataURL` is the URL of the cropped image
        file: image.file, // Keep reference to the original file if needed
      })),
    ];

    return {
      ...prevProduct,
      ProductImages: updatedImages,
    };
  });
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

    product?.ProductImages?.forEach((file) => {
      if (file && file.file instanceof File) {
        formData.append(`photos`, file.file, file.file.name);
      }
    });

    formData.append("sizes", JSON.stringify(values?.SizeItems));

    try {
      const response = await dispatch(updateProduct(formData)).unwrap();

      router.push(`/shop/product/${response.product.id}`);

      Toast.fire({
        icon: "success",
        title: "Product updated successfully",
      });
    } catch (error: any) {
      Toast.fire({
        icon: "error",
        title: `Failed to update product: ${error.message}`,
      });
    }
  };


  const handleDeleteImage = async (index: number) => {
  
   if (!product?.ProductImages) {
    // Handle the case where ProductImages is undefined or null
    console.error('ProductImages is undefined or null.');
    return;
  }

  const imageToDelete: ImageListType | any = product.ProductImages[index];
    console.log(imageToDelete?.imageUrl, "imageToDelete");
    console.log(isonline)
  if (isonline && imageToDelete?.imageUrl) {
    try {
      // Send a request to the server to delete the image
      await dispatch(deleteProductImage(imageToDelete.imageUrl)).unwrap();

      // Remove the image locally only if the server deletion is successful
      setProduct((prevProduct) => ({
        ...prevProduct,
        ProductImages: prevProduct?.ProductImages?.filter((_, i) => i !== index) || [],
      }));

      Toast.fire({
        icon: "success",
        title: "Image deleted successfully",
      });
    } catch (error: any) {
      Toast.fire({
        icon: "error",
        title: `Failed to delete image: ${error.message}`,
      });
    }
  } else {
    // For locally added images (not online), simply remove it from the array
    setProduct((prevProduct) => ({
      ...prevProduct,
      ProductImages: prevProduct?.ProductImages?.filter((_, i) => i !== index) || [],
    }));
  }
};

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <section>
        <h2>Edit Product</h2>
        <Formik
          initialValues={product}
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
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      handleStoreChange(event, setFieldValue)
                    }
                  >
                    <option value="">Select store</option>
                    {listOfStores?.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="storeId" component="div" />
                  <Field type="hidden" id="categoryId" name="categoryId" />
                </div>
              ) : (
                "Loading store data..."
              )}

              {listOfSubCategories ? (
                <div>
                  <label htmlFor="subcategoryId">Subcategory:</label>
                  <Field as="select" id="subcategoryId" name="subcategoryId">
                    <option value="">Select subcategory</option>
                    {listOfSubCategories?.map((subCategorie) => (
                      <option key={subCategorie.id} value={subCategorie.id}>
                        {subCategorie.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="subcategoryId" component="div" />
                </div>
              ) : (
                "Loading subCategories data..."
              )}

              <FieldArray name="sizes">
                {({ push, remove, form }) => (
                  <div>
                    <label>Sizes and Quantities:</label>
                    {form.values.SizeItems.map((size: ISize, index: number) => (
                      <div key={index}>
                        <Field as="select" name={`sizes[${index}].sizeId`}>
                          <option value="">Select size</option>
                          {listOfSizes?.map((size: ISize) => (
                            <option key={size.id} value={size.id}>
                              {size.size}
                            </option>
                          ))}
                        </Field>
                        <Field
                          type="number"
                          name={`sizes[${index}].quantity`}
                          placeholder="Quantity"
                        />
                        <button type="button" onClick={() => remove(index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push({ sizeId: "", quantity: 0 })}
                    >
                      Add Size
                    </button>
                  </div>
                )}
              </FieldArray>

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
                <label htmlFor="slug">Slug:</label>
                <Field type="text" id="slug" name="slug" />
                <ErrorMessage name="slug" component="div" />
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
                Update Product
              </button>
            </Form>
          )}
        </Formik>
        <ImageUploadComponent
          onImagesChange={handlePhotoChange}
          defaultImages={product?.photos || []} // Add a fallback to an empty array
        />
    
        <ImageViewer productImages={product?.ProductImages || []} isonline={isonline} onDeleteImage={handleDeleteImage}/>
      </section>
    </Layout>
  );
}

export default protectedRoute(EditProduct);
