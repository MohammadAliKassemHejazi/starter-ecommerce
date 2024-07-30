import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation } from 'swiper/modules';
import Image from "next/image";
import React from 'react';

interface Props {
  imageLinks: string[];
}

export default function MySwiperComponent({ imageLinks }: Props) {
  return (
    <div className="row">
      <div className="col-1 align-self-center">
        <div className="prev" role="button" data-bs-slide="prev">
          <i className="text-dark fas fa-chevron-left"></i>
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
          // onSwiper={(swiper : any) => console.log(swiper)}
          // onSlideChange={() => console.log('slide change')}
        >
          {imageLinks.map((link, index) => (
            <SwiperSlide key={index}>
              <a href="#">
                <Image className="card-img img-fluid" src={link} alt={`Product Image ${index + 1}`} width={128.79} height={128.79} layout="responsive" quality={75} />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="col-1 align-self-center">
        <div className="next" role="button" data-bs-slide="next">
          <i className="text-dark fas fa-chevron-right"></i>
          <span className="sr-only">Next</span>
        </div>
      </div>
    </div>
  );
}
