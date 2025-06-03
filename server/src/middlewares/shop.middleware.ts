import { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'fs';
import sharp from 'sharp';

export const shopMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      // Handle the case where no files were uploaded
      console.log('⚠️ No files to process, skipping...');
      next();
      return;
    }

    // Define paths for uploads and compressed directories
    const uploadsDir = path.join(__dirname, "..", "..", 'uploads');
    const compressedDir = path.join(__dirname, "..", "..", 'compressed');

    // Debug: Log contents of uploads directory before processing
    console.log('📂 Contents of uploads directory before processing:');
    try {
      const uploadsContents = fs.readdirSync(uploadsDir);
      uploadsContents.forEach((file) => {
        const filePath = path.join(uploadsDir, file);
        const isDirectory = fs.statSync(filePath).isDirectory();
        console.log(`${isDirectory ? '📁' : '📄'} ${file}`);
      });
    } catch (err) {
      console.error('❌ Failed to read uploads directory:', err);
    }

    // Process each uploaded file (resize and compress if it's an image)
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const filePath = file.path; // Get the path of the uploaded file
        const fileName = file.filename;
        const outputPath = path.join(compressedDir, fileName); // Specify output path for compressed file

        if (file.mimetype.startsWith('image/')) {
          // Read file buffer from file path
          const fileBuffer = fs.readFileSync(filePath);

          // Resize and compress image using sharp
          const compressedImageBuffer = await sharp(fileBuffer)
            .resize({ width: 800 }) // Resize image to a maximum width of 800px
            .jpeg({ quality: 80 }) // Convert image to JPEG format with 80% quality
            .toBuffer(); // Get the compressed image buffer

          // Write the compressed image buffer to the output path
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

    // Debug: Log contents of uploads directory after processing
    console.log('📂 Contents of uploads directory after processing:');
    try {
      const uploadsContents = fs.readdirSync(uploadsDir);
      if (uploadsContents.length === 0) {
        console.log('📦 Uploads directory is empty.');
      } else {
        uploadsContents.forEach((file) => {
          const filePath = path.join(uploadsDir, file);
          const isDirectory = fs.statSync(filePath).isDirectory();
          console.log(`${isDirectory ? '📁' : '📄'} ${file}`);
        });
      }
    } catch (err) {
      console.error('❌ Failed to read uploads directory:', err);
    }

    // Debug: Log contents of compressed directory after processing
    console.log('📂 Contents of compressed directory after processing:');
    try {
      const compressedContents = fs.readdirSync(compressedDir);
      if (compressedContents.length === 0) {
        console.log('📦 Compressed directory is empty.');
      } else {
        compressedContents.forEach((file) => {
          const filePath = path.join(compressedDir, file);
          const isDirectory = fs.statSync(filePath).isDirectory();
          console.log(`${isDirectory ? '📁' : '📄'} ${file}`);
        });
      }
    } catch (err) {
      console.error('❌ Failed to read compressed directory:', err);
    }

    // Do something with the processed files if needed
    console.log('✅ Processed files:', processedFiles);

    next();
  } catch (error) {
    console.error('❌ Error in shopMiddleWare:', error);
    next(error);
  }
};