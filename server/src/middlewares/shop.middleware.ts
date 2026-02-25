import { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import sharp from 'sharp';

export const shopMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next();
    }

    // Define paths using the global base directory
    const uploadsDir = path.join(global.__basedir, 'uploads');
    const compressedDir = path.join(global.__basedir, 'compressed');

    // Ensure compressed directory exists - recursive: true is safe even if it exists
    await fs.mkdir(compressedDir, { recursive: true });

    // Process each uploaded file
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const filePath = file.path;
        const fileName = file.filename;
        const outputPath = path.join(compressedDir, fileName);

        if (file.mimetype.startsWith('image/')) {
          try {
            // Read file buffer
            const fileBuffer = await fs.readFile(filePath);

            // Resize and compress image using sharp
            const compressedImageBuffer = await sharp(fileBuffer)
              .resize({ width: 800 }) // Standardize width for frontend consistency
              .jpeg({ quality: 80 })
              .toBuffer();

            // Write the compressed image and delete the original to save space
            await fs.writeFile(outputPath, compressedImageBuffer);
            await fs.unlink(filePath);

            return {
              originalname: fileName,
              mimetype: 'image/jpeg',
              buffer: compressedImageBuffer,
            };
          } catch (imageError) {
            throw new Error(`Failed to process image ${fileName}: ${imageError}`);
          }
        } else {
          try {
            // For non-image files, read buffer and delete original
            const fileBuffer = await fs.readFile(filePath);
            await fs.unlink(filePath);

            return {
              originalname: fileName,
              mimetype: file.mimetype,
              buffer: fileBuffer,
            };
          } catch (nonImageError) {
            throw new Error(`Failed to process non-image file ${fileName}: ${nonImageError}`);
          }
        }
      })
    );

    // Attach processed files to the request object. 
    // This ensures the next controller receives the data in the exact shape expected.
    req.body.processedFiles = processedFiles;

    next();
  } catch (error) {
    console.error('❌ Error in shopMiddleWare:', error);
    next(error);
  }
};