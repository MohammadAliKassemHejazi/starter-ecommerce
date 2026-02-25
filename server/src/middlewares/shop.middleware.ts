import { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
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

    // Define paths for uploads and compressed directories using the global base directory
    const uploadsDir = path.join(global.__basedir, 'uploads'); // Absolute path to uploads
    const compressedDir = path.join(global.__basedir, 'compressed'); // Absolute path to compressed

    // Debug: Log contents of uploads directory before processing
    console.log('📂 Contents of uploads directory before processing:');
    try {
      const uploadsContents = await fs.readdir(uploadsDir);
      if (uploadsContents.length === 0) {
        console.log('📦 Uploads directory is empty.');
      } else {
        for (const file of uploadsContents) {
          const filePath = path.join(uploadsDir, file);
          const stats = await fs.stat(filePath);
          const isDirectory = stats.isDirectory();
          console.log(`${isDirectory ? '📁' : '📄'} ${file}`);
        }
      }
    } catch (err) {
      console.error('❌ Failed to read uploads directory:', err);
    }

    // Ensure compressed directory exists
    console.log('🗂️ Compressed directory path:', compressedDir);
    try {
      await fs.mkdir(compressedDir, { recursive: true });
      console.log('✅ Compressed directory ensured successfully');
    } catch (dirError) {
      console.error('❌ Failed to ensure compressed directory:', dirError);
      throw new Error(`Failed to ensure compressed directory: ${dirError}`);
    }

    // Process each uploaded file (resize and compress if it's an image)
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const filePath = file.path; // Get the path of the uploaded file
        const fileName = file.filename;
        const outputPath = path.join(compressedDir, fileName); // Specify output path for compressed file

        console.log(`📍 File paths for ${fileName}:`);
        console.log('  Input path:', filePath);
        console.log('  Output path:', outputPath);

        if (file.mimetype.startsWith('image/')) {
          console.log(`🖼️ Processing image: ${fileName}`);

          try {
            // Read file buffer from file path
            console.log(`📖 Reading file buffer for ${fileName}...`);
            const fileBuffer = await fs.readFile(filePath);
            console.log(`✅ File buffer read successfully, size: ${fileBuffer.length} bytes`);

            // Resize and compress image using sharp
            console.log(`🔄 Compressing image: ${fileName}...`);
            const compressedImageBuffer = await sharp(fileBuffer)
              .resize({ width: 800 }) // Resize image to a maximum width of 800px
              .jpeg({ quality: 80 }) // Convert image to JPEG format with 80% quality
              .toBuffer(); // Get the compressed image buffer

            console.log(`✅ Image compressed successfully, new size: ${compressedImageBuffer.length} bytes`);

            // Write the compressed image buffer to the output path
            console.log(`💾 Writing compressed image to: ${outputPath}`);
            await fs.writeFile(outputPath, compressedImageBuffer);
            console.log(`✅ Compressed image written successfully`);

            // Delete the original uploaded file
            console.log(`🗑️ Deleting original file: ${filePath}`);
            await fs.unlink(filePath);
            console.log(`✅ Original file deleted successfully`);

            return {
              originalname: fileName,
              mimetype: 'image/jpeg', // Set the MIME type to JPEG after compression
              buffer: compressedImageBuffer,
            };
          } catch (imageError) {
            console.error(`❌ Error processing image ${fileName}:`, imageError);
            throw new Error(`Failed to process image ${fileName}: ${imageError}`);
          }
        } else {
          console.log(`📄 Processing non-image file: ${fileName}`);

          try {
            // For non-image files, return the original file buffer without compression
            console.log(`📖 Reading non-image file buffer for ${fileName}...`);
            const fileBuffer = await fs.readFile(filePath);
            console.log(`✅ Non-image file buffer read successfully, size: ${fileBuffer.length} bytes`);

            // Delete the original uploaded file
            console.log(`🗑️ Deleting original non-image file: ${filePath}`);
            await fs.unlink(filePath);
            console.log(`✅ Original non-image file deleted successfully`);

            return {
              originalname: fileName,
              mimetype: file.mimetype,
              buffer: fileBuffer,
            };
          } catch (nonImageError) {
            console.error(`❌ Error processing non-image file ${fileName}:`, nonImageError);
            throw new Error(`Failed to process non-image file ${fileName}: ${nonImageError}`);
          }
        }
      }),
    );

    // Debug: Log contents of uploads directory after processing
    console.log('📂 Contents of uploads directory after processing:');
    try {
      const uploadsContents = await fs.readdir(uploadsDir);
      if (uploadsContents.length === 0) {
        console.log('📦 Uploads directory is empty.');
      } else {
        for (const file of uploadsContents) {
          const filePath = path.join(uploadsDir, file);
          const stats = await fs.stat(filePath);
          const isDirectory = stats.isDirectory();
          console.log(`${isDirectory ? '📁' : '📄'} ${file}`);
        }
      }
    } catch (err) {
      console.error('❌ Failed to read uploads directory:', err);
    }

    // Debug: Log contents of compressed directory after processing
    console.log('📂 Contents of compressed directory after processing:');
    try {
      const compressedContents = await fs.readdir(compressedDir);
      if (compressedContents.length === 0) {
        console.log('📦 Compressed directory is empty.');
      } else {
        for (const file of compressedContents) {
          const filePath = path.join(compressedDir, file);
          const stats = await fs.stat(filePath);
          const isDirectory = stats.isDirectory();
          console.log(`${isDirectory ? '📁' : '📄'} ${file}`);
        }
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
