import Image from 'next/image';
import React, { useState, SyntheticEvent } from 'react';
import { ImageType } from 'react-images-uploading';

interface DynamicSizedImageProps {
  file: ImageType;
  index: any; // Adjust the type of index according to your needs
  constrainWidth?: boolean;
}

const DynamicSizedImage: React.FC<DynamicSizedImageProps> = ({ file , index,constrainWidth = false }) => {
  const [calculatedWidth, setCalculatedWidth] = useState<number>(0);
  const [calculatedHeight, setCalculatedHeight] = useState<number>(0);

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const imgElement = e.target as HTMLImageElement;
    const { naturalWidth, naturalHeight } = imgElement;
    const maxWidth =   (constrainWidth = true) ? 800 : 800 ; // Define your maximum width here
    const aspectRatio = naturalWidth / naturalHeight;

    const widthToFit = Math.min(naturalWidth, maxWidth);
    const heightToFit = widthToFit / aspectRatio;

  
    setCalculatedWidth(widthToFit);
    setCalculatedHeight(heightToFit);
  };

   return (
  

           <Image
        key={index}
        src={file.data_url ?? ""}
        alt={`Cropped Image ${index}`}
        onLoad={handleImageLoad}
        width={calculatedWidth}
       height={calculatedHeight}
       quality={90}
     
      />
      
    
  );
};

export default DynamicSizedImage;
