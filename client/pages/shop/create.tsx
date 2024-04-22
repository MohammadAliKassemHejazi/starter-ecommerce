import React, { useState } from "react";
import { IProductModel } from "../../src/models/product.model";
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(product).forEach(([key, value]) => {
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
      // Redirect to the newly created product page
      // Modify the router.push according to your application structure
      router.push(`/shop/${response.id}`);
      // Show success message
      Toast.fire({
        icon: "success",
        title: "Product created successfully",
      });
    } catch (error: any) {
      // Handle error
      Toast.fire({
        icon: "error",
        title: `Failed to create product: ${error.message}`,
      });
    }
  };

  const handlePhotoChange = (croppedImages: ImageListType) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      croppedPhotos: croppedImages,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  return (
     <Layout>
    <section>
      <h2>Create Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price.toString()}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="isActive">Is Active:</label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={product.isActive || false}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Create Product</button>
      </form>

        <ImageUploadComponent onImagesChange={handlePhotoChange}  defaultImages={product.photos}/>

        <div>
          <h3>Cropped Images</h3>
          <ImageViewer croppedPhotos={product.croppedPhotos} />
        </div>
      </section>
      </Layout>
  );
}

export default CreateProduct;
