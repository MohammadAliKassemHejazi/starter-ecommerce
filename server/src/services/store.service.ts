import { IStoreCreateProduct } from 'interfaces/types/controllers/store.controller.types';
import { IProductAttributes } from 'interfaces/types/models/product.model.types';
import {ICategoryAttributes} from 'interfaces/types/models/category.model.types';
import { IProductImageAttributes } from 'interfaces/types/models/productimage.model.types';
import db from '../models/index';
import { IStoreAttributes } from 'interfaces/types/models/store.model.types';



 const createStoreWithImages = async (storeData: IStoreCreateProduct, files: Express.Multer.File[]): Promise<any> => {
     try {
          var Store =  storeData
         if (files.length > 0) {
              Store = await db.Store.create({ ...storeData , imgUrl :`/uploads/${files[0].filename}`});
         }
         else {
             throw Error
         }

    return  Store  ;
  } catch (error) {

    throw error;
    
  }
};


 const getStoreById = async (
  StoretId: string
): Promise<{ store: IStoreAttributes } | null> => {
  const store: IStoreAttributes  = await db.Store.findOne({
    where: { id: StoretId },
    raw: true,
  });
 
  return  { store };
};

const getAllStores = async (UserID: string): Promise<{ stores: IStoreAttributes[] } | null> => {
  const stores: IStoreAttributes[] | null = await db.Store.findAll({
    where: { userId: UserID },
  });
  if (!stores) {
    return null;
  }



  return { stores };
};

export default {
  createStoreWithImages,
  getStoreById,
  getAllStores
};
