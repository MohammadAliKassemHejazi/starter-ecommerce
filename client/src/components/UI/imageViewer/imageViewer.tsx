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
interface ImageViewerProps {
  croppedPhotos: Blob[];
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
      {croppedPhotos.map((blob, index) => (
        <div key={index} onClick={() => handleImageClick(index)}>
          <Image
            src={URL.createObjectURL(blob)}
            alt={`Cropped Image ${index}`}
            className={styles["thumbnail-image"]}
            width={800}
            height={600} // Adjust dimensions as needed
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
            {croppedPhotos.map((blob, index) => (
              <SwiperSlide key={index}  className={styles["swiper-slide"]}>
                <DynamicSizedImage
                  blob={blob}
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
