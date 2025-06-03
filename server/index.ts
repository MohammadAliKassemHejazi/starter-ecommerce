// Import necessary modules
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import winston from 'winston';
import path from 'node:path';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';

// Import routes and middlewares
import { orderRouter, cartRouter, authRouter, userRouter, articleRouter, shopRouter, storeRouter, utileRouter, paymentRouter, categoriesRouter, usersRouter, ordersRouter, permissionsRouter, rolesRouter, subcategoriesRouter, dashboardRouter } from './src/routes';
import { CustomError } from './src/utils/customError';
import config from './src/config/config';
import db from './src/models';
import seedDatabase from './seedDataBase';
import { storeMiddleWear } from './src/middlewares/store.middleweare';
import { shopMiddleWare } from './src/middlewares/shop.middleware';

// Create directories relative to the dist folder where the app is running
const uploadsDir = path.join(__dirname, 'uploads');      // This will be dist/uploads
const compressedDir = path.join(__dirname, 'compressed'); // This will be dist/compressed

// Debugging to confirm paths
console.log('__dirname:', __dirname);
console.log('Uploads directory:', uploadsDir);
console.log('Compressed directory:', compressedDir);

// Ensure directories exist
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Uploads directory created successfully');
  }
  if (!fs.existsSync(compressedDir)) {
    fs.mkdirSync(compressedDir, { recursive: true });
    console.log('✅ Compressed directory created successfully');
  }
} catch (error) {
  console.error('❌ Failed to create directories:', error);
  process.exit(1); // Exit the application if directory creation fails
}

// Set up Winston for logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Create an Express application
const app: Express = express();

// Serve static files
app.use('/compressed', express.static(path.join(__dirname, 'compressed')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable trust proxy - this should be one of the first configurations
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // Trust the first proxy in production
} else {
  app.set('trust proxy', 'loopback'); // Trust loopback addresses in development
}

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply middleware
app.use(helmet()); // Apply helmet for security headers
app.use(express.json({ limit: '50mb' })); // Increase JSON body size limit
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Increase URL-encoded body size limit
app.use(cors()); // Open to all
app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } })); // HTTP logging
app.use(limiter); // Apply rate limiting

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const random = Math.floor(Math.random() * 100001) + 1;
    cb(null, `${random}-${file.originalname}`); // Unique filename
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    console.warn(`⚠️ Rejected file: ${file.originalname} (Mimetype: ${file.mimetype})`);
    cb(null, false); // Reject the file
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB file size limit
    files: 6, // Maximum of 6 files per request
  },
});

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('SERVER');
});

app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/shop', (req, res, next) => {
  upload.array('photos', 6)(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err.message);
      return res.status(400).json({ message: 'File upload failed', error: err.message });
    }
    next();
  });
}, shopMiddleWare, shopRouter);

app.use('/api/store', (req, res, next) => {
  upload.array('photos', 5)(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err.message);
      return res.status(400).json({ message: 'File upload failed', error: err.message });
    }
    next();
  });
}, storeMiddleWear, storeRouter);

app.use('/api/auth', authRouter);
app.use('/api/utile', utileRouter);
app.use('/api/users', userRouter);
app.use('/api/articles', articleRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/permissions', permissionsRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/subcategories', subcategoriesRouter);
app.use('/api/inventory', dashboardRouter);

// Error handling middleware
app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
  });
  res.status(error.statusCode || 500).json({
    error: {
      message: error.message,
      code: error.code,
      data: error.data,
    },
  });
});

// Sync the database and start the server
const PORT = process.env.PORT || config.port;
app.listen(Number(PORT), async () => {
  try {
    console.log('🔄 Performing complete database reset...');
    
    // Drop all tables and recreate them
    if (process.env.NODE_ENV !== 'production') {
      await db.sequelize.sync({ force: true });
      console.log('✅ Database schema has been reset.');
      
      // Seed the database
      await seedDatabase();
      console.log('✅ Database seeded successfully.');
    } else {
      await db.sequelize.authenticate();
      console.log('✅ Database connection established.');
    }
  } catch (error) {
    console.error('❌ Failed to reset and seed database:', error);
    process.exit(1); // Exit the application on failure
  }
  
  logger.info(`Server is running on port ${PORT} in ${app.get('env')} mode`);
});