// Import necessary modules
import express, { Express, Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import winston from 'winston';
import { swaggerOption } from './src/config/swagger';
import { authRouter, userRouter, articleRouter ,shopRouter , storeRouter,utileRouter } from './src/routes';
import { CustomError } from './src/utils/customError';
import config from './src/config/config';
import db from './src/models';
import multer, { FileFilterCallback } from 'multer';
import sharp from 'sharp';
import path from 'node:path';
import fs from 'fs';
import * as  spdy from 'spdy';
import seedDatabase from './seedDataBase';
// Set up Winston for logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

// Create an Express application
const app: Express = express();

//static paths
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Apply middleware
app.use(helmet()); // Apply helmet for security headers

// Increase the request body size limit for JSON bodies
app.use(express.json({ limit: '10mb' }));

// Increase the request body size limit for URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:3000']; // Add more origins as needed
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));



app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) }})); // HTTP logging

// Set up rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per 15 minutes
});
app.use(limiter);

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOption.options));

//Storage

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const random = Math.floor(Math.random() * 100001) + 1;
    cb(null, random + "-" + file.originalname);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true); // Accept the file
  } else {
    cb(null, false); // Reject the file
  }
};

const upload = multer({ storage: storage,fileFilter: fileFilter,limits: {
    fileSize: 10 * 1024 * 1024, 
    files: 5 
  } });

// Routes
app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('SERVER');
    next();
});
app.use('/api/auth', authRouter);
app.use('/api/utile', utileRouter);
app.use('/api/users', userRouter);
app.use('/api/articles', articleRouter);
app.use('/api/shop', upload.array('photos', 5),async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];
    if(!files){
      next();
    }
    // Process each uploaded file (resize and compress if it's an image)
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const filePath = file.path; // Get the path of the uploaded file
        const fileName = file.filename;
        const outputPath = path.join(__dirname, 'compressed', fileName); // Specify output path for compressed file

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
            buffer: compressedImageBuffer
          };
        } else {
          // For non-image files, return the original file buffer without compression
          const fileBuffer = fs.readFileSync(filePath);

          // Delete the original uploaded file
          fs.unlinkSync(filePath);

          return {
            originalname: fileName,
            mimetype: file.mimetype,
            buffer: fileBuffer
          };
        }
      })
    );

  } catch (error) {
    next(error);
  }
  next()
}, shopRouter);

app.use('/api/store', upload.array('photos', 5),async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];
    if(!files || files === undefined){
    
    }else{
    // Process each uploaded file (resize and compress if it's an image)
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const filePath = file.path; // Get the path of the uploaded file
        const fileName = file.filename;
        const outputPath = path.join(__dirname, 'compressed', fileName); // Specify output path for compressed file

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
            buffer: compressedImageBuffer
          };
        } else {
          // For non-image files, return the original file buffer without compression
          const fileBuffer = fs.readFileSync(filePath);

          // Delete the original uploaded file
          fs.unlinkSync(filePath);

          return {
            originalname: fileName,
            mimetype: file.mimetype,
            buffer: fileBuffer
          };
        }
      })
    );
  }
  } catch (error) {
    next(error);
  }
  next()
},storeRouter);


// Error handling middleware
app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
    logger.error(error); // Log the error
    res.status(error.statusCode || 500).json({
        error: {
            message: error.message,
            code: error.code,
            data: error.data,
        }
    });
});

// Set up the server

const PORT = process.env.PORT || config.port;

app.listen(Number(PORT), () => {

  logger.info(`Server is running on port ${PORT} in ${app.get('env')} mode`);
  
});

// to enable http2
// const options = {
//   key: fs.readFileSync('path/to/server.key'),
//   cert:  fs.readFileSync('path/to/server.crt')
// };

// spdy
//   .createServer(options, app)
//   .listen(Number(PORT), () => {
//     console.log('Listening on port: ' + PORT + '.');
//   })
//   ;

// Sync the database
if (process.env.NODE_ENV !== 'production') {
    db.sequelize.sync().then(() => {
      // seedDatabase();
        logger.info('Database synced');
    }).catch((err: Error) => {
        logger.error('Error syncing database:', err);
    });
}


