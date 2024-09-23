import React, { useCallback, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import {
  IProductModel,
  IProductModelErrors,
} from "../../../src/models/product.model";
import { useAppDispatch, store } from "@/store/store";
import { createProduct } from "@/store/slices/shopSlice";
import ImageUploadComponent from "@/components/UI/General/ImageUploadComponent/ImageUploadComponent";
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
import { useSelector } from "react-redux";
import { ISize } from "@/models/size.model";

const isonline = false

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
  const listOfSubCategories = useSelector(utileSubCategoriesSelector);
  const listOfSizes = useSelector(utileSizes);
  React.useEffect(() => {
    store.dispatch(fetchAllStores());
    store.dispatch(fetchAllSizes());
  }, [dispatch]);

  const handleStoreChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: Function
  ) => {
     const selectedStoreId = event.target.value;
  const selectedStore = listOfStores?.find(store => store.id === selectedStoreId);
  const categoryId = selectedStore ? selectedStore.categoryId : '';

  // Set the storeId
  setFieldValue("storeId", selectedStoreId);
  // Set the corresponding categoryId
  setFieldValue("categoryId", categoryId);

  dispatch(fetchAllSubCategoriesID(categoryId));
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
    ProductImages: [],
  });

  const initialValues: IProductModel = {
    name: "",
    description: "",
    price: 0,
    isActive: false,
    subcategoryId: "",
    storeId: "",
    categoryId: "", // Added categoryId to initial values
    metaTitle: "",
    metaDescription: "",
    photos: [],
    ProductImages: [],
    SizeItems: [{ sizeId: "", quantity: 0 , Size:{size:""} }],
  };

  const handlePhotoChange = useCallback((croppedImages: ImageListType) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      ProductImages: croppedImages,
    }));
  }, []);

  const handleSubmit = async (values: IProductModel) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key !== "photos" ) {
        formData.append(
          key,
          typeof value === "boolean" ? value.toString() : value
        );
      }
    });

    product.ProductImages?.forEach((file) => {
      if (file && file.file instanceof File) {
        formData.append(`photos`, file.file, file.file.name);
      }
    });


// values?.sizes?.forEach((size, index) => {
//   formData.append(`sizes[${index}][sizeId]`, size.sizeId);
//   formData.append(`sizes[${index}][quantity]`, size.quantity.toString());
// });
    
    formData.append('sizes', JSON.stringify(values?.SizeItems));


    

    try {
      const response = await dispatch(createProduct(formData)).unwrap();

      router.push(`/shop/product/${response.product.id}`);

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

    const handleDeleteImage = async (index: number) => {
  
   if (!product?.ProductImages) {
    // Handle the case where ProductImages is undefined or null
    console.error('ProductImages is undefined or null.');
    return;
  }

  const imageToDelete: ImageListType | any = product.ProductImages[index];
    console.log(imageToDelete?.imageUrl, "imageToDelete");

 
    setProduct((prevProduct) => ({
      ...prevProduct,
      ProductImages: prevProduct?.ProductImages?.filter((_, i) => i !== index) || [],
    }));
  
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
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      handleStoreChange(event, setFieldValue)
                    }
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

              {listOfSubCategories ? (
                <div>
                  <label htmlFor="subcategoryId">Subcategory:</label>
                  <Field as="select" id="subcategoryId" name="subcategoryId">
                    <option value="">Select subcategory</option>
                    {listOfSubCategories?.map((subCategorie) => {
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

 <FieldArray name="sizes">
                {({ push, remove, form }) => (
                  <div>
                    <label>Sizes and Quantities:</label>
                    {form.values.SizeItems.map((size:ISize, index:number) => (
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
                <label htmlFor="slug">slug:</label>
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
          <ImageViewer productImages={product.ProductImages ?? []} isonline={isonline} onDeleteImage={handleDeleteImage}/>
        </div>
      </section>
    </Layout>
  );
}

export default protectedRoute(CreateProduct);
