import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation } from 'swiper/modules';
import Image from "next/image";
import React, { useState } from 'react';

interface Props {
  imageLinks: string[];
}

export default function MySwiperComponent({ imageLinks }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setCurrentImageIndex(swiper.activeIndex);
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="row">
      <div className="col-12 mb-3 d-flex justify-content-center">
        <Image
          className="img-fluid"
          src={imageLinks[currentImageIndex]}
          alt={`Cover Image`}
          width={256}
          height={256}
          quality={100} // Increase quality to 100
          priority={true} // Prioritize loading the cover image
        />
      </div>
      <div className="col-1 align-self-center">
        <div className="prev" role="button" data-bs-slide="prev">
          <i className="fas fa-chevron-left" style={{ color: 'var(--bs-body-color)' }}></i>
          <span className="sr-only">Previous</span>
        </div>
      </div>
      <div className="col-10">
        <Swiper
          modules={[Navigation]}
          spaceBetween={50}
          slidesPerView={3}
          navigation={{
            prevEl: '.prev',
            nextEl: '.next',
          }}
          onSlideChange={handleSlideChange}
        >
          {imageLinks.map((link, index) => (
            <SwiperSlide key={index} onClick={() => handleImageClick(index)}>
              <Image
                className="card-img img-fluid"
                src={link}
                alt={`Product Image ${index + 1}`}
                width={128.79}
                height={128.79}
                layout="responsive"
                quality={75}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="col-1 align-self-center">
        <div className="next" role="button" data-bs-slide="next">
          <i className="fas fa-chevron-right" style={{ color: 'var(--bs-body-color)' }}></i>
          <span className="sr-only">Next</span>
        </div>
      </div>
    </div>
  );
}