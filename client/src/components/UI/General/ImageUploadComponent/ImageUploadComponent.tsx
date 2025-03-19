import React, { useState, useEffect, ButtonHTMLAttributes } from 'react';
import ImageUploading, { ImageListType, ImageType } from 'react-images-uploading';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import DynamicSizedImage from '../dynamicSizeImage/dynamicSizeImage'; // Replace with your actual import path

interface ImageUploadProps {
  onImagesChange: (images: ImageListType) => void;
  defaultImages?: ImageListType;
}

const ImageUploadComponent: React.FC<ImageUploadProps> = ({
  onImagesChange,
  defaultImages = [],
}) => {
  const [cropData, setCropData] = useState<{ [key: number]: Crop }>({});
  const [uploadedImages, setUploadedImages] = useState<ImageListType>(defaultImages);
  const [croppedImages, setCroppedImages] = useState<ImageListType>([]);

  useEffect(() => {
    setUploadedImages(defaultImages);
  }, [defaultImages]);

  useEffect(() => {
    onImagesChange(croppedImages);
  }, [croppedImages, onImagesChange]);

  const handlePhotoChange = async (imageList: ImageListType) => {
    const newCropData: { [key: number]: Crop } = {};
    const updatedCroppedImages: ImageListType = [];

    for (let index = 0; index < imageList.length; index++) {
      const image = imageList[index];
      const crop = cropData[index];

      if (image.file && crop) {
        try {
        const imgElement = document.getElementById(`${index}_image`) as HTMLImageElement;

        // Pass the image's actual width and height to scaleImage
        const scaledImage = await scaleImage(image.file, imgElement.width, imgElement.height);
          const croppedFile = await getCroppedFile(scaledImage, crop);
          newCropData[index] = crop;

          const newImage: ImageType = {
            ...image, // spread other properties to keep them if needed
            file: croppedFile,
            data_url: URL.createObjectURL(croppedFile),
          };

          updatedCroppedImages.push(newImage);
        } catch (error) {
          console.error('Error cropping image:', error);
        }
      }
    }

    // Update crop data state
    setCropData(newCropData);

    // Remove cropped images from uploadedImages and trigger callback with updated cropped images
    setUploadedImages((prevImages) => prevImages.filter((img, idx) => !newCropData[idx]));

    setCroppedImages((prevCroppedImages) => {
      const newCroppedImages = [...prevCroppedImages, ...updatedCroppedImages];
      return newCroppedImages;
    });
  };

  const handleCropChange = (newCrop: Crop, imageIndex: number) => {
    setCropData((prevData) => ({
      ...prevData,
      [imageIndex]: newCrop,
    }));
  };

  const scaleImage = async (imageFile: File, maxWidth: number, maxHeight: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(imageFile);

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const scaleX = Math.min(maxWidth / image.naturalWidth, 1);
          const scaleY = Math.min(maxHeight / image.naturalHeight, 1);
          canvas.width = image.naturalWidth * scaleX;
          canvas.height = image.naturalHeight * scaleY;

          ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], imageFile.name, { type: blob.type }));
            } else {
              reject(new Error('Failed to scale image'));
            }
          }, imageFile.type || 'image/jpeg');
        } else {
          reject(new Error('Failed to initialize canvas context'));
        }
      };

      image.onerror = (error) => {
        reject(new Error(error + 'Failed to load image'));
      };
    });
  };

  const getCroppedFile = (imageFile: File, crop: Crop): Promise<File> => {
    return new Promise((resolve, reject) => {
      const image = document.createElement('img');
      image.src = URL.createObjectURL(imageFile);

      image.onload = () => {
        const canvas = document.createElement('canvas');

        if (!crop || !canvas || !image) {
          return;
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // refer https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
          const pixelRatio = window.devicePixelRatio;

          canvas.width = crop.width * pixelRatio * scaleX;
          canvas.height = crop.height * pixelRatio * scaleY;

          // refer https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
          ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          ctx.imageSmoothingQuality = 'high';

          // refer https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
          ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
          );

          canvas.toBlob((blob) => {
            if (blob) {
              URL.createObjectURL(blob);

              const croppedFile = new File([blob], imageFile.name, {
                type: blob.type,
              });
              resolve(croppedFile);
            } else {
              reject(new Error('Failed to crop image'));
            }
          }, imageFile.type || 'image/jpeg');
        } else {
          reject(new Error('Failed to initialize canvas context'));
        }
      };

      image.onerror = (error) => {
        reject(new Error(error + 'Failed to load image'));
      };
    });
  };

  return (
    <ImageUploading
      multiple
      value={uploadedImages}
      onChange={setUploadedImages}
      dataURLKey="data_url"
    >
      {({ imageList, onImageUpload }) => (
        <div>
          <button   onClick={(e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior if needed
    onImageUpload(); // Ensure the function is invoked
  }}>Upload Photos</button>
          {imageList.map((image: ImageType, index: number) => (
            <div key={index}>
              {!!image.file && (
                <div>
                  <ReactCrop
                    crop={cropData[index]}
                    onChange={(newCrop) => handleCropChange(newCrop, index)}
                    minWidth={20}
                    minHeight={20}
                    aspect={500 / 720}
                  >
                    <DynamicSizedImage url={image.data_url ?? ""} index={index} constrainWidth={true} />
                  </ReactCrop>
                  <button onClick={(e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior if needed
    handlePhotoChange([image])// Ensure the function is invoked
  }}>Confirm Crop</button>
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
