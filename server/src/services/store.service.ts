
import { IStoreCreateProduct } from 'interfaces/types/controllers/store.controller.types';
import { IProductAttributes } from 'interfaces/types/models/product.model.types';
import {ICategoryAttributes} from 'interfaces/types/models/category.model.types';
import { IProductImageAttributes } from 'interfaces/types/models/productimage.model.types';
import db from '../models/index';



 const createStoreWithImages = async (storeData: IStoreCreateProduct, files: Express.Multer.File[]): Promise<any> => {
     try {
          var Store =  storeData
         if (files.length > 0) {
              Store = await db.Store.create({ storeData , imgUrl :`/uploads/${files[0].filename}`  });
         }
         else {
             throw Error
         }

    return {
      Store
    };
  } catch (error) {

    throw error;
    
  }
};


 const getProductById = async (
  productId: string
): Promise<{ product: IProductAttributes; images: IProductImageAttributes[] } | null> => {
  const product: IProductAttributes | null = await db.Product.findOne({
    where: { id: productId },
    raw: true,
  });
  if (!product) {
    return null;
  }

  const images: IProductImageAttributes[] = await db.ProductImage.findAll({
    where: { productId },
    raw: true,
  });

  return { product, images };
};

const getAllCategories = async (): Promise<{ categories: ICategoryAttributes[] } | null> => {
  const categories: ICategoryAttributes[] | null = await db.Category.findAll();
  if (!categories) {
    return null;
  }



  return { categories };
};

export default {
  createStoreWithImages,
  getProductById,
  getAllCategories
};
