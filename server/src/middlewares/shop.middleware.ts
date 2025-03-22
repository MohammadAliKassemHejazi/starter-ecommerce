import  {  Request, Response, NextFunction } from 'express';

import path from 'node:path';
import fs from 'fs';
import sharp from 'sharp';
export const shopMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      // Handle the case where no files were uploaded
      next();
     return
    }

    // Process each uploaded file (resize and compress if it's an image)
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const filePath = file.path; // Get the path of the uploaded file
        const fileName = file.filename;
        const outputPath = path.join(__dirname,"..","..", 'compressed', fileName); // Specify output path for compressed file

        if (file.mimetype.startsWith('image/')) {
          // Read file buffer from file path
          const fileBuffer = fs.readFileSync(filePath);

          // Resize and compress image using sharp
          const compressedImageBuffer = await sharp(fileBuffer)
            .resize({ width: 800 }) // Resize image to a maximum width of 800px
            .jpeg({ quality: 80 }) // Convert image to JPEG format with 80% quality (adjust as needed)
            .toBuffer(); // Get the compressed image buffer

          // Write the compressed image buffer to the output path (optional)
          fs.writeFileSync(outputPath, compressedImageBuffer);

          // Delete the original uploaded file
          fs.unlinkSync(filePath);

          return {
            originalname: fileName,
            mimetype: 'image/jpeg', // Set the MIME type to JPEG after compression
            buffer: compressedImageBuffer,
          };
        } else {
          // For non-image files, return the original file buffer without compression
          const fileBuffer = fs.readFileSync(filePath);

          // Delete the original uploaded file
          fs.unlinkSync(filePath);

          return {
            originalname: fileName,
            mimetype: file.mimetype,
            buffer: fileBuffer,
          };
        }
      })
    );

    // Do something with the processed files if needed
    console.log(processedFiles);

    next();
  } catch (error) {
    next(error);
  }
}