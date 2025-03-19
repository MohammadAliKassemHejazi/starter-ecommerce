import React, { useEffect, useState, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import {
  IProductModel,
  IProductModelErrors,
} from "../../../src/models/product.model";
import { useAppDispatch } from "@/store/store";
import { updateProduct, fetchProductById, deleteProductImage } from "@/store/slices/shopSlice";
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
  
  const [product, setProduct] = useState<IProductModel>();
 
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id as string))
        .unwrap()
         .then((fetchedProduct: IProductModel | any) => {
    // Create a shallow copy of fetchedProduct
    const updatedProduct = {
      ...fetchedProduct,
      discount: fetchedProduct.discount ?? 0, // Set default value for discount
    };

    // Update the state with the copied object
    setProduct(updatedProduct);

    // Fetch subcategories based on categoryId
    dispatch(fetchAllSubCategoriesID(updatedProduct.categoryId ?? ""));
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
  setProduct((prevProduct: any) => {
    if (!prevProduct) {return prevProduct;}  // ✅ Prevent errors if `product` is undefined

    const existingImages = prevProduct?.ProductImages || [];
    const updatedImages = [
      ...existingImages,
      ...croppedImages.map((image) => ({
        imageUrl: "40627-coding-event.avif",
        file: image.file,
      })),
    ]; 

    console.log(croppedImages)

    return {
      ...prevProduct,
      ProductImages: updatedImages,
    };
  });
}, [setProduct]);


  const handleSubmit = async (values: IProductModel) => {
    debugger
    console.log(product);
    const formData = new FormData();
debugger
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "photos") {
        if(key !== "id"){
         
        formData.append(
          key,
          typeof value === "boolean" ? value.toString() : value
          );
          }
      }
    });
      formData.append("productID",id!.toString());
    product?.ProductImages?.forEach((file) => {
      if (file && file.file instanceof File) {
        formData.append(`photos`, file.file, file.file.name);
      }
    });

    formData.append("sizes", JSON.stringify(values?.SizeItems));

    try {
      debugger
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
      await dispatch(deleteProductImage(imageToDelete.id)).unwrap();

      // Remove the image locally only if the server deletion is successful
      setProduct((prevProduct:any) => ({
        ...prevProduct,
        ProductImages: prevProduct?.ProductImages?.filter((_: any, i: number) => i !== index) || [],
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
    setProduct((prevProduct:any) => ({
      ...prevProduct,
      ProductImages: prevProduct?.ProductImages?.filter((_: any, i: number) => i !== index) || [],
    }));
  }
  };

  useEffect(() => {
  console.log("Current product state:", product);  
}, [product]);

  if (!product) {
    return <div>Loading...</div>;
  }

return (
  <Layout>
    <section>
      <div className="container">
        <h2 className="text-center mb-4">Edit Product</h2>
        <Formik
            initialValues={product || { name: "", price: 0, description: "", isActive: false, storeId: "", categoryId: "", sizes: [], ProductImages: [] }}
          enableReinitialize={true} 
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
                  <FieldArray name="sizes">
                    {({ push, remove, form }) => (
                      <div>
                        {form.values.SizeItems.map((_size: ISize, index: number) => (
                          <div key={index} className="d-flex align-items-center mb-3">
                            <Field
                              as="select"
                              name={`sizes[${index}].sizeId`}
                              className="form-control mr-2"
                            >
                              <option value="">Select size</option>
                              {listOfSizes?.map((sizeOption: ISize) => (
                                <option key={sizeOption.id} value={sizeOption.id}>{sizeOption.size}</option>
                              ))}
                            </Field>
                            <Field
                              type="number"
                              name={`sizes[${index}].quantity`}
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
                    <Field type="number" className="form-control" id="discount" name="discount"  />
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
                    defaultImages={product?.photos || []}
                  />
                  <h3 className="mt-4">Cropped Images</h3>
                  <ImageViewer
                    productImages={product?.ProductImages || []}
                    isonline={isonline}
                    onDeleteImage={handleDeleteImage}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                Update Product
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  </Layout>
);
}

export default protectedRoute(EditProduct);
