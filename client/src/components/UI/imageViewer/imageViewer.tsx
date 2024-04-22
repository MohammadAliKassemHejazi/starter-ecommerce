import 'swiper/css'; 
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import React, { useState } from 'react';
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import styles from "./style.module.css"
import Image from 'next/image';
import DynamicSizedImage from '../dynamicSizeImage/dynamicSizeImage';
import { ImageListType, ImageType } from 'react-images-uploading';
interface ImageViewerProps {
  croppedPhotos: ImageListType;
}


const ImageViewer: React.FC<ImageViewerProps> = ({ croppedPhotos }) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  SwiperCore.use([Navigation, Pagination]);

  const handleImageClick = (index: number) => {
    setActiveIndex(index);
    setFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setFullscreen(false);
  };

  return (
    <div className={styles["image-container"]}>
      {croppedPhotos.map((image: ImageType, index) => (
        <div key={index} onClick={() => handleImageClick(index)}>
            <DynamicSizedImage
                  file={image}
                  index = {index}
                />
        </div>
      ))}

      {fullscreen && (
        <div className={styles["fullscreen-modal"]} onClick={handleCloseFullscreen}>
          <Swiper
            className={styles["swiper-container"]}
            initialSlide={activeIndex}
            navigation
            pagination={{ clickable: true }}
          >
            {croppedPhotos.map((image: ImageType, index) => (
              <SwiperSlide key={index}  className={styles["swiper-slide"]}>
                <DynamicSizedImage
                  file={image}
                  index = {index}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
