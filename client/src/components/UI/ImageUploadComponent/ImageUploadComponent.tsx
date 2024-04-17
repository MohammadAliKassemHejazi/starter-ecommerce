import React, { useState, useEffect } from "react";
import ImageUploading, { ImageListType, ImageType } from "react-images-uploading";
import ReactCrop, { Crop } from "react-image-crop";
import Image from "next/image";
import "react-image-crop/dist/ReactCrop.css";

interface ImageUploadProps {
  onImagesChange: (images: ImageListType) => void;
  defaultImages?: ImageListType;
}

const ImageUploadComponent: React.FC<ImageUploadProps> = ({ onImagesChange, defaultImages = [] }) => {
  
  const [cropData, setCropData] = useState<{ [key: number]: Crop }>({});
  const [uploadedImages, setUploadedImages] = useState<ImageListType>(defaultImages);
  const [croppedImages, setCroppedImages] = useState<ImageListType>([]);

  useEffect(() => {
    setUploadedImages(defaultImages);
  }, [defaultImages]);

  const handlePhotoChange = async (imageList: ImageListType) => {
  const newCropData: { [key: number]: Crop } = {};
  const updatedCroppedImages: ImageListType[] = [];

  for (let index = 0; index < imageList.length; index++) {
    const image = imageList[index];
    const crop = cropData[index];

    if (image.file && crop) {
      try {
        const croppedBlob = await getCroppedFile(image.file, crop) ;
        newCropData[index] = crop; // Save crop data for the uploaded image
        updatedCroppedImages.push(croppedBlob as unknown as ImageListType) ; // Add cropped blob to the updated cropped images
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    }
  }

  // Update crop data state
  setCropData(newCropData);

  // Remove cropped images from uploadedImages and trigger callback with updated cropped images
  setUploadedImages((prevImages) =>
    prevImages.filter((img, idx) => !newCropData[idx]) // Filter out images with crop data
  );

  // Update the croppedImages state with the accumulated new cropped images
  setCroppedImages((prevCroppedImages) => [...prevCroppedImages, ...updatedCroppedImages]);

  // Trigger callback with all cropped images (excluding undefined blobs)
  const filteredCroppedImages = croppedImages.filter((blob) => blob !== undefined);
  onImagesChange(filteredCroppedImages);
};


    const handleCropChange = (newCrop: Crop, imageIndex: number) => {
        console.log(newCrop);
    setCropData((prevData) => ({
      ...prevData,
      [imageIndex]: newCrop,
    }));
  };

  const getCroppedFile = (imageFile: File, crop: Crop): Promise<File> => {
  return new Promise((resolve, reject) => {
    const image = document.createElement("img");
    image.src = URL.createObjectURL(imageFile);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = crop.width!;
        canvas.height = crop.height!;

        ctx.drawImage(
          image,
          crop.x! * scaleX,
          crop.y! * scaleY,
          crop.width! * scaleX,
          crop.height! * scaleY,
          0,
          0,
          crop.width!,
          crop.height!
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new File object with the original filename
              const croppedFile = new File([blob], imageFile.name, { type: blob.type });
              resolve(croppedFile);
            } else {
              reject(new Error("Failed to crop image"));
            }
          },
          imageFile.type || "image/jpeg"
        );
      } else {
        reject(new Error("Failed to initialize canvas context"));
      }
    };

    image.onerror = (error) => {
      reject(new Error("Failed to load image"));
    };
  });
};


  return (
    <ImageUploading multiple value={uploadedImages} onChange={setUploadedImages} dataURLKey="data_url">
      {({ imageList, onImageUpload }) => (
        <div>
          <button onClick={onImageUpload}>Upload Photos</button>
          {imageList.map((image: ImageType, index: number) => (
            <div key={index}>
              {!!image.file && (
                <div>
                  <ReactCrop
                    crop={cropData[index]}
                    onChange={(newCrop) => handleCropChange(newCrop, index)}
                    minWidth={100}
                    minHeight={100}
                  >
                    <Image src={image.data_url} alt={`Image ${index}`} width={800} height={600} />
                  </ReactCrop>
                  <button onClick={() => handlePhotoChange([image])}>Confirm Crop</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ImageUploading>
  );
};

export default ImageUploadComponent;
