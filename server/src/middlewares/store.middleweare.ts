import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export const storeMiddleWear = async (req: Request, res: Response, next: NextFunction) => {
  console.log('🚀 Starting storeMiddleWear processing...');
  
  try {
    const files = req.files as Express.Multer.File[];

    // Debug: Log initial file info
    console.log('📁 Files received:', files ? files.length : 0);
    if (files) {
      files.forEach((file, index) => {
        console.log(`📄 File ${index + 1}:`, {
          originalname: file.originalname,
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path
        });
      });
    }
    
    if (!files || files === undefined || files.length === 0) {
      console.log('⚠️ No files to process, skipping...');
      next();
      return;
    }

    // Define paths for uploads and compressed directories
    const uploadsDir = path.join(global.__basedir, 'uploads');
    const compressedDir = path.join(global.__basedir, 'compressed');

    // Debug: Log contents of uploads directory before processing
    console.log('📂 Contents of uploads directory before processing:');
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

    // Check if compressed directory exists
    console.log('🗂️ Compressed directory path:', compressedDir);
    console.log('🗂️ Compressed directory exists:', fs.existsSync(compressedDir));
    
    // Create compressed directory if it doesn't exist
    if (!fs.existsSync(compressedDir)) {
      console.log('📁 Creating compressed directory...');
      try {
        fs.mkdirSync(compressedDir, { recursive: true });
        console.log('✅ Compressed directory created successfully');
      } catch (dirError) {
        console.error('❌ Failed to create compressed directory:', dirError);
        throw new Error(`Failed to create compressed directory: ${dirError}`);
      }
    }

    // Process each uploaded file
    console.log('🔄 Starting file processing...');
    const processedFiles = await Promise.all(
      files.map(async (file, index) => {
        console.log(`\n🔄 Processing file ${index + 1}/${files.length}: ${file.originalname}`);
        
        try {
          const filePath = file.path;
          const fileName = file.filename;
          const outputPath = path.join(compressedDir, fileName);
          
          console.log(`📍 File paths for ${fileName}:`);
          console.log('  Input path:', filePath);
          console.log('  Output path:', outputPath);
          console.log('  File exists:', fs.existsSync(filePath));

          // Check if input file exists
          if (!fs.existsSync(filePath)) {
            throw new Error(`Input file does not exist: ${filePath}`);
          }

          // Get file stats
          const fileStats = fs.statSync(filePath);
          console.log(`📊 File stats for ${fileName}:`, {
            size: fileStats.size,
            isFile: fileStats.isFile(),
            birthtime: fileStats.birthtime
          });

          if (file.mimetype.startsWith('image/')) {
            console.log(`🖼️ Processing image: ${fileName}`);
            
            try {
              // Read file buffer from file path
              console.log(`📖 Reading file buffer for ${fileName}...`);
              const fileBuffer = fs.readFileSync(filePath);
              console.log(`✅ File buffer read successfully, size: ${fileBuffer.length} bytes`);

              // Resize and compress image using sharp
              console.log(`🔄 Compressing image: ${fileName}...`);
              const compressedImageBuffer = await sharp(fileBuffer)
                .resize({ width: 800 })
                .jpeg({ quality: 80 })
                .toBuffer();
              
              console.log(`✅ Image compressed successfully, new size: ${compressedImageBuffer.length} bytes`);

              // Write the compressed image buffer to the output path
              console.log(`💾 Writing compressed image to: ${outputPath}`);
              fs.writeFileSync(outputPath, compressedImageBuffer);
              console.log(`✅ Compressed image written successfully`);

              // Delete the original uploaded file
              console.log(`🗑️ Deleting original file: ${filePath}`);
              fs.unlinkSync(filePath);
              console.log(`✅ Original file deleted successfully`);

              return {
                originalname: fileName,
                mimetype: 'image/jpeg',
                buffer: compressedImageBuffer
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
              const fileBuffer = fs.readFileSync(filePath);
              console.log(`✅ Non-image file buffer read successfully, size: ${fileBuffer.length} bytes`);

              // Delete the original uploaded file
              console.log(`🗑️ Deleting original non-image file: ${filePath}`);
              fs.unlinkSync(filePath);
              console.log(`✅ Original non-image file deleted successfully`);

              return {
                originalname: fileName,
                mimetype: file.mimetype,
                buffer: fileBuffer
              };
              
            } catch (nonImageError) {
              console.error(`❌ Error processing non-image file ${fileName}:`, nonImageError);
              throw new Error(`Failed to process non-image file ${fileName}: ${nonImageError}`);
            }
          }
          
        } catch (fileError) {
          console.error(`❌ Error processing individual file ${file.originalname}:`, fileError);
          throw fileError;
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

    console.log('✅ All files processed successfully');
    console.log(`📊 Processed ${processedFiles.length} files`);
    
    // Store processed files in request object for next middleware
    (req as any).processedFiles = processedFiles;
    
    next();
    
  } catch (error) {
    console.error('❌ Fatal error in storeMiddleWear:', error);
    console.error('Error stack:', error);
    
    // Create a detailed error object
    let errorMessage = 'Unknown error';
    let errorStack = undefined;
    if (typeof error === 'object' && error !== null) {
      if ('message' in error && typeof (error as any).message === 'string') {
        errorMessage = (error as any).message;
      }
      if ('stack' in error && typeof (error as any).stack === 'string') {
        errorStack = (error as any).stack;
      }
    }
    const detailedError = {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
      middleware: 'storeMiddleWear',
      files: req.files ? (req.files as Express.Multer.File[]).map(f => ({
        originalname: f.originalname,
        filename: f.filename,
        path: f.path,
        size: f.size
      })) : null
    };
    
    console.error('🔍 Detailed error info:', JSON.stringify(detailedError, null, 2));
    
    next(error);
  }
};