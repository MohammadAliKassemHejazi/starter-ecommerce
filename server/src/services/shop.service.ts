
import { IProductAttributes } from 'interfaces/types/models/product.model.types';
import { IProductImageAttributes } from 'interfaces/types/models/productimage.model.types';
import db from 'models';


import fs from 'fs';
import path from 'path';
import { FastifyRequest, FastifyReply } from 'fastify';

// export const createProductWithImages = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
//   try {
//     const productData = JSON.parse(request.body.productData); // Assuming product data is sent as JSON in the request body
//     const files = request.raw.files; // Access uploaded files directly from the request object

//     // Handle product creation
//     const product = await db.Product.create(productData);

//     // Handle file uploads
//     const uploadDirectory = path.join(__dirname, '..', 'uploads');
//     if (!fs.existsSync(uploadDirectory)) {
//       fs.mkdirSync(uploadDirectory);
//     }

//     const imageUrls: string[] = [];
//     for (const file of files) {
//       const imagePath = path.join(uploadDirectory, file.filename);
//       await fs.promises.writeFile(imagePath, file.data);
//       const imageUrl = `/uploads/${file.filename}`;
//       imageUrls.push(imageUrl);
      
//       // You can also save the image data to your database if needed
//       await db.ProductImage.create({
//         productId: product.id,
//         imageUrl: imageUrl
//       });
//     }

//     // Return response with product and image URLs
//     return {
//       product: product,
//       images: imageUrls
//     };
//   } catch (error) {
//     // Handle errors appropriately
//     console.error(error);
//     reply.code(500).send({ error: 'Internal Server Error' });
//   }
// };


export const getProductById = async (
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



export default {
  
  getProductById,
};
