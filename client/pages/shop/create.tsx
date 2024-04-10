import React, { useState } from "react";
import ImageUploading, {
  ImageListType,
  ImageType,
} from "react-images-uploading";
import Image from "next/image";
import { Product } from "../../src/models/product.model";

function CreateProduct() {
  const [product, setProduct] = useState<Product>({
    id: "",
    name: "",
    description: "",
    price: 0,
    photos: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you can perform the logic to submit the product data
    console.log(product);
    // You can send an HTTP request to your backend to save the product data
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
