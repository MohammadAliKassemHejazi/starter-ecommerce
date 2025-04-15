import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useState } from "react";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import styles from "./style.module.css";
import Image from "next/image";
import DynamicSizedImage from "../dynamicSizeImage/dynamicSizeImage";
import { ImageListType, ImageType } from "react-images-uploading";
interface ImageViewerProps {
  productImages: ImageListType;
  isonline?: Boolean;
  isStore?: Boolean;
  onDeleteImage?: (index: number) => void; // Add onDeleteImage prop
}

const ImageViewer: React.FC<ImageViewerProps> = ({ productImages ,isStore =false, isonline = false,onDeleteImage}) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  SwiperCore.use([Navigation, Pagination]);

  const handleImageClick = (index: number) => {
    if (isStore === true) { 
      return
    }
    setActiveIndex(index);
    setFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setFullscreen(false);
  };
  const handleDeleteImage = (index: number) => {
   
    if (productImages.length > 1 && isonline === true) {
      if (onDeleteImage) {
      onDeleteImage(index);
      }
    }else{
       if (onDeleteImage) {
      onDeleteImage(index);
      }
    }
  };

  return (
    <div className={styles["image-container"]}>
   
      {productImages.map((image: ImageType | any, index) => (
        <div   key={index} className={styles["image-wrapper"]}>
    
        <div key={index} onClick={() => handleImageClick(index)}>
          <Image
              src={(isonline === true) ? (process.env.NEXT_PUBLIC_BASE_URL_Images + image.imageUrl) : (image.data_url ?? "")}
            height={isStore ? (800/2):(720/2)}
            width={isStore ? (1200/2):(500/2)}
            alt={index + ""}
          />
        </div>
          <div>
            <button
              
            className={styles["delete-button"]}
              onClick={(e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior if needed

  

                handleDeleteImage(index)
              }}
          ></button>
          </div>
          </div>
      ))}

      {fullscreen && (
        <div
          className={styles["fullscreen-modal"]}
          onClick={handleCloseFullscreen}
        >
          <Swiper
            className={styles["swiper-container"]}
            initialSlide={activeIndex}
            navigation
            pagination={{ clickable: true }}
            
          >
            {productImages.map((image: ImageType | any, index) => (
              <SwiperSlide key={index} className={styles["swiper-slide"]}>
                <DynamicSizedImage url={(isonline === true) ? (process.env.NEXT_PUBLIC_BASE_URL_Images + image.imageUrl) :(image.data_url ?? "")} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
