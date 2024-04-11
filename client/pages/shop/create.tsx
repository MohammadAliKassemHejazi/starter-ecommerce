import React, { useState } from "react";
import ImageUploading, {
  ImageListType,
  ImageType,
} from "react-images-uploading";
import Image from "next/image";
import { IProductModel } from "../../src/models/product.model";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/store/store";
import { createProduct } from "@/store/slices/shopSlice";

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
  const dispatch = useAppDispatch();
  const router = useRouter()
  const [product, setProduct] = useState<IProductModel>({
    name: "",
    description: "",
    price: 0,
    photos: [],
  });

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(product).forEach(([key, value]) => {
      if (key !== 'photos') {
        formData.append(key, typeof value === 'boolean' ? value.toString() : value);
      }
    });

    product.photos.forEach((photo, index) => {
      if (photo.file) {
        formData.append(`photos`, photo.file);
      }
    });

    try {
      const response = await dispatch(createProduct(formData)).unwrap();
      
      Toast.fire({
        icon: 'success',
        title: 'Product created successfully',
      });
    } catch (error : any) {
      Toast.fire({
        icon: 'error',
        title: `Failed to create product: ${error.message}`,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handlePhotoChange = (imageList: ImageListType) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      photos: imageList,
    }));
  };



  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="h1 muted">Create Product</h2>
          </div>
        </div>
      </div>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
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
                <label htmlFor="stockQuantity">Stock Quantity:</label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  value={product.stockQuantity?.toString() || ""}
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
            </div>
            <div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <label className="muted">Photos:</label>
                <ImageUploading
                  multiple
                  value={product.photos}
                  onChange={handlePhotoChange}
                  dataURLKey="data_url"
                >
                  {({ imageList, onImageUpload, onImageRemoveAll }) => (
                    <div>
                      <button onClick={onImageUpload}>Upload Photos</button>
                      <button onClick={onImageRemoveAll}>
                        Remove All Photos
                      </button>
                      {imageList.map((image: ImageType, index: number) => (
                        <div key={index}>
                          <Image
                            src={image["data_url"]}
                            alt={`Product Photo ${index}`}
                            width="100"
                             height="100"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </ImageUploading>
              </div>
            </div>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateProduct;


