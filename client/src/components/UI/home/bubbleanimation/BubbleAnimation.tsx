import React from 'react';
import Image from 'next/image'; // Assuming you're using Next.js for images
import styles from './BubbleAnimation.module.css'; // Your CSS module for styling
import {  IStoreResponseModel } from '@/models/store.model';


interface BubbleAnimationProps {
  stores: IStoreResponseModel[]; 
}

const BubbleAnimation: React.FC<BubbleAnimationProps> = ({ stores }) => {
  return (
    <div className="container container-hidden">
      <div className={`text-center ${styles["circular-container"]}`}>
        {stores.map((store : IStoreResponseModel, index : number) => (
          <div
            key={index}
            className={`${styles["bubble"]} ${styles["scaling-animation"]}`}
            style={{
              animationDuration: `${Math.random() * 2 + 1}s`, // Random duration between 1 and 3 seconds
              animationDelay: `${Math.random() * 2}s`, // Random delay between 0 and 2 seconds
            }}
          >
            <div className={styles["bubble-logo"]}>
              <Image src={ process.env.NEXT_PUBLIC_BASE_URL_Images + store.imgUrl} alt={`${store.name} logo`} width={100} height={100} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BubbleAnimation;
