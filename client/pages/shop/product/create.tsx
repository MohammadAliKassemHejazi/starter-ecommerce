import React, { useCallback, useState, useEffect } from "react";
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
import ProtectedRoute from "@/components/protectedRoute";
import { getUserPackageLimits } from "@/services/packageService";
import { PackageLimits } from "@/components/Package/PackageLimits";

import { fetchAllStores, storeSelector } from "@/store/slices/storeSlice";
import {
  fetchAllSizes,
  fetchAllSubCategoriesID,
  utileSizes,
  utileSubCategoriesSelector,
} from "@/store/slices/utilsSlice";
import { useSelector } from "react-redux";
import { ISize } from "@/models/size.model";

const isonline = false;

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
  const [packageLimits, setPackageLimits] = useState<any>(null);
  const [canCreateProduct, setCanCreateProduct] = useState(false);

  // Correctly using the selector to get single store data
  const listOfStores = useSelector(storeSelector);
  const listOfSubCategories = useSelector(utileSubCategoriesSelector);
  const listOfSizes = useSelector(utileSizes);
  
  React.useEffect(() => {
    store.dispatch(fetchAllStores());
    store.dispatch(fetchAllSizes());
    loadPackageLimits();
  }, [dispatch]);

  const loadPackageLimits = async () => {
    try {
      const limits = await getUserPackageLimits();
      setPackageLimits(limits);
      setCanCreateProduct(limits.data.canCreateProduct);
    } catch (error) {
      console.error('Error loading package limits:', error);
    }
  };

  const handleStoreChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: Function
  ) => {
    const selectedStoreId = event.target.value;
    const selectedStore = listOfStores?.find(
      (store) => store.id === selectedStoreId
    );
    const categoryId = selectedStore ? selectedStore.categoryId : "";

    // Set the storeId
    setFieldValue("storeId", selectedStoreId);
    // Set the corresponding categoryId
    setFieldValue("categoryId", categoryId);
    console.log("Selected Category ID:", categoryId);
    console.log("Selected Store ID:", selectedStoreId);
    dispatch(fetchAllSubCategoriesID(categoryId));
  };

  const [product, setProduct] = useState<IProductModel>({
    name: "",
    description: "",
    price: 0,
    discount:0,
    isActive: false,
    subcategoryId: "",
    storeId: "",
    metaTitle: "",
    metaDescription: "",
    photos: [],
    ProductImages: [],
    originalPrice:0,
  });

  const initialValues: IProductModel = {
    name: "",
    description: "",
    price: 0,
    originalPrice:0,
    isActive: false,
    subcategoryId: "",
    storeId: "",
    categoryId: "", // Added categoryId to initial values
    metaTitle: "",
    metaDescription: "",
    photos: [],
    ProductImages: [],
    SizeItems: [{ sizeId: "", quantity: 0, Size: { size: "" } }],
  };

  const handlePhotoChange = useCallback((croppedImages: ImageListType) => {
    
    setProduct((prevProduct) => ({
      ...prevProduct,
      ProductImages: croppedImages,
    }));
  }, []);

  const handleSubmit = async (values: IProductModel) => {
    if (!canCreateProduct) {
      Toast.fire({
        icon: "error",
        title: "You have reached your product creation limit. Please upgrade your package.",
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

    product.ProductImages?.forEach((file) => {
      if (file && file.file instanceof File) {
        formData.append(`photos`, file.file, file.file.name);
      }
    });

    // values?.sizes?.forEach((size, index) => {
    //   formData.append(`sizes[${index}][sizeId]`, size.sizeId);
    //   formData.append(`sizes[${index}][quantity]`, size.quantity.toString());
    // });

    formData.append("sizes", JSON.stringify(values?.SizeItems));

    try {
      const response = await dispatch(createProduct(formData)).unwrap();

      router.push(`/shop/product/${response.data.id}`);

      Toast.fire({
        icon: "success",
        title: "Product created successfully",
      });
      
      // Reload package limits after successful creation
      loadPackageLimits();
    } catch (error: any) {
      Toast.fire({
        icon: "error",
        title: `Failed to create product: ${error.message}`,
      });
    }
  };

const handleDeleteImage = async (index: number) => {
  if (!product?.ProductImages || !product?.photos) {
    console.error("ProductImages or photos is undefined or null.");
    return;
  }
  
 const newProductImages = product.ProductImages!.filter((_, i) => i !== index)
    const newphotos= product.photos!.filter((_, i) => i !== index)
  // Remove the image from both ProductImages and photos
  setProduct((prevProduct) => ({
    ...prevProduct,
    ProductImages: newProductImages,
    photos: newphotos,
  }));
  handlePhotoChange(newProductImages);
};

if (!canCreateProduct && packageLimits) {
  return (
    <Layout>
      <section>
        <div className="container">
          <h2 className="text-center mb-4">Create Product</h2>
          <div className="alert alert-warning">
            <h4>Product Creation Limit Reached</h4>
            <p>You have reached your product creation limit ({packageLimits.currentProductCount}/{packageLimits.productLimit}).</p>
            <p>Please upgrade your package to create more products.</p>
          </div>
          <PackageLimits />
        </div>
      </section>
    </Layout>
  );
}

return (
  <Layout>
    <section>
      <div className="container">
        <h2 className="text-center mb-4">Create Product</h2>
        
        {/* Package Limits Display */}
        <div className="mb-4">
          <PackageLimits />
        </div>
        
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
              {/* Product Information Card */}
              <div className="card mb-4">
                <div className="card-header">Product Information</div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <Field type="text" className="form-control" id="name" name="name" />
                        <ErrorMessage name="name" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="price">Price:</label>
                        <Field type="number" className="form-control" id="price" name="price" />
                        <ErrorMessage name="price" component="div" className="text-danger" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <Field as="textarea" className="form-control" id="description" name="description" rows="4" />
                    <ErrorMessage name="description" component="div" className="text-danger" />
                  </div>
                  <div className="form-group form-check">
                    <Field type="checkbox" className="form-check-input" id="isActive" name="isActive" />
                    <label className="form-check-label" htmlFor="isActive">Is Active</label>
                  </div>
                  {listOfStores ? (
                    <div className="form-group">
                      <label htmlFor="storeId">Store:</label>
                      <Field
                        as="select"
                        className="form-control"
                        id="storeId"
                        name="storeId"
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleStoreChange(event, setFieldValue)}
                      >
                        <option value="">Select store</option>
                        {listOfStores?.map((store) => (
                          <option key={store.id} value={store.id}>{store.name}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="storeId" component="div" className="text-danger" />
                      <Field type="hidden" id="categoryId" name="categoryId" />
                    </div>
                  ) : (
                    <div>Loading store data...</div>
                  )}
                  {listOfSubCategories ? (
                    <div className="form-group">
                      <label htmlFor="subcategoryId">Subcategory:</label>
                      <Field
                        as="select"
                        className="form-control"
                        id="subcategoryId"
                        name="subcategoryId"
                      >
                        <option value="">Select subcategory</option>
                        {listOfSubCategories?.map((subCategory) => (
                          <option key={subCategory.id} value={subCategory.id}>{subCategory.name}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="subcategoryId" component="div" className="text-danger" />
                    </div>
                  ) : (
                    <div>Loading subcategories data...</div>
                  )}
                </div>
              </div>

              {/* Sizes Card */}
              <div className="card mb-4">
                <div className="card-header">Sizes and Quantities</div>
                <div className="card-body">
                  <FieldArray name="SizeItems">
                    {({ push, remove, form }) => (
                      <div>
                        {form.values.SizeItems.map((size :any, index : number) => (
                          <div key={index} className="d-flex align-items-center mb-3">
                            <Field
                              as="select"
                              name={`SizeItems[${index}].sizeId`}
                              className="form-control mr-2"
                            >
                              <option value="">Select size</option>
                              {listOfSizes?.map((sizeOption: ISize) => (
                                <option key={sizeOption.id} value={sizeOption.id}>{sizeOption.size}</option>
                              ))}
                            </Field>
                            <Field
                              type="number"
                              name={`SizeItems[${index}].quantity`}
                              className="form-control mr-2"
                              placeholder="Quantity"
                            />
                            <button type="button" className="btn btn-danger" onClick={() => remove(index)}>Remove</button>
                          </div>
                        ))}
                        <button type="button" className="btn btn-success" onClick={() => push({ sizeId: "", quantity: 0 })}>Add Size</button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>

              {/* Additional Information Card */}
              <div className="card mb-4">
                <div className="card-header">Additional Information</div>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="discount">Sale Discount:</label>
                    <Field type="number" className="form-control" id="discount" name="discount" />
                    <ErrorMessage name="discount" component="div" className="text-danger" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="tags">Tags:</label>
                    <Field type="text" className="form-control" id="tags" name="tags" />
                    <ErrorMessage name="tags" component="div" className="text-danger" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="slug">Slug:</label>
                    <Field type="text" className="form-control" id="slug" name="slug" />
                    <ErrorMessage name="slug" component="div" className="text-danger" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="metaTitle">Meta Title:</label>
                    <Field type="text" className="form-control" id="metaTitle" name="metaTitle" />
                    <ErrorMessage name="metaTitle" component="div" className="text-danger" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="metaDescription">Meta Description:</label>
                    <Field as="textarea" className="form-control" id="metaDescription" name="metaDescription" rows="4" />
                    <ErrorMessage name="metaDescription" component="div" className="text-danger" />
                  </div>
                </div>
              </div>

              {/* Image Upload and Viewer Section */}
              <div className="card mb-4">
                <div className="card-header">Product Images</div>
                <div className="card-body">
                  <ImageUploadComponent
                    onImagesChange={handlePhotoChange}
                    updatedPhotos={product?.ProductImages || []}
                    defaultImages={product.photos ?? []}
                  />
                  <h3 className="mt-4">Cropped Images</h3>
                  <ImageViewer
                    productImages={product.ProductImages ?? []}
                    isonline={isonline}
                    onDeleteImage={handleDeleteImage}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                Create Product
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  </Layout>
);
}

export default function ProtectedCreateProduct() {
  return (
    <ProtectedRoute>
      <CreateProduct />
    </ProtectedRoute>
  );
}
