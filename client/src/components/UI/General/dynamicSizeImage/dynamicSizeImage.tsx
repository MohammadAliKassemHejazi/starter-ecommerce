import Image from 'next/image';
import React, { useState, SyntheticEvent } from 'react';


interface DynamicSizedImageProps {
  url: string;
  index: any; // Adjust the type of index according to your needs
  constrainWidth?: boolean;
  isonline ?: boolean;
}

const DynamicSizedImage: React.FC<DynamicSizedImageProps> = ({ url ,index,constrainWidth = false,isonline = false }) => {
  const [calculatedWidth, setCalculatedWidth] = useState<number>(0);
  const [calculatedHeight, setCalculatedHeight] = useState<number>(0);

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const imgElement = e.target as HTMLImageElement;
    const { naturalWidth, naturalHeight } = imgElement;
    const maxWidth =  720 ; // Define your maximum width here
    const aspectRatio = naturalWidth / naturalHeight;

    const widthToFit = Math.min(naturalWidth, maxWidth);
    const heightToFit = widthToFit / aspectRatio;

  
    setCalculatedWidth(widthToFit);
    setCalculatedHeight(heightToFit);
  };

   return (
  

           <Image
       key={index}
       id={index+"_image"}
        src={url}
        alt={`Cropped Image ${index}`}
        onLoad={handleImageLoad}
        width={calculatedWidth}
       height={calculatedHeight}
       
     
      />
      
    
  );
};

export default DynamicSizedImage;
