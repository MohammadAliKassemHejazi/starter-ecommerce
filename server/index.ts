// Import necessary modules
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import path from 'node:path';
import fs from 'fs/promises';
import multer, { FileFilterCallback } from 'multer';
import bcrypt from 'bcrypt';
// Import routes and middlewares
import { 
  orderRouter, cartRouter, authRouter, userRouter, articleRouter, 
  shopRouter, storeRouter, utileRouter, paymentRouter, categoriesRouter, 
  usersRouter, ordersRouter, permissionsRouter, rolesRouter, 
  subcategoriesRouter, dashboardRouter, favoriteRouter, commentRouter, promotionRouter,
  analyticsRouter, auditLogRouter, translationRouter, packageRouter, shippingRouter,
  sizeRouter, taxRouter, userSessionRouter, returnRouter
} from './src/routes';
import swaggerUi from 'swagger-ui-express';
import { createSwaggerFile } from './src/config/swagger';
import { CustomError } from './src/utils/customError';
import config from './src/config/config';
import db from './src/models';
import seedDatabase from './seedDataBase';
import { storeMiddleWear } from './src/middlewares/store.middleweare';
import { shopMiddleWare } from './src/middlewares/shop.middleware';

// Extend NodeJS global type to include __basedir
declare global {
  var __basedir: string;
}

// Environment variables validation
const requiredEnvVars = ['NODE_ENV'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Constants
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = Number(process.env.PORT) || config.port || 3000;
const IS_PRODUCTION = NODE_ENV === 'production';

// Define the base directory
global.__basedir = __dirname;

// Directory setup
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const COMPRESSED_DIR = path.join(__dirname, 'compressed');
const LOG_DIR = path.join(__dirname, 'logs');

// Async directory creation with better error handling
async function createRequiredDirectories(): Promise<void> {
  const directories = [
    { path: UPLOAD_DIR, name: 'uploads' },
    { path: COMPRESSED_DIR, name: 'compressed' },
    { path: LOG_DIR, name: 'logs' }
  ];

  try {
    await Promise.all(
      directories.map(async ({ path: dirPath, name }) => {
        try {
          await fs.access(dirPath);
        } catch {
          await fs.mkdir(dirPath, { recursive: true });
          console.log(`✅ ${name} directory created: ${dirPath}`);
        }
      })
    );
  } catch (error) {
    console.error('❌ Failed to create required directories:', error);
    throw error;
  }
}

// Enhanced Winston logger configuration
const createLogger = (): winston.Logger => {
  const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  );

  const transports: winston.transport[] = [
    new winston.transports.File({ 
      filename: path.join(LOG_DIR, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: path.join(LOG_DIR, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
  ];

  if (!IS_PRODUCTION) {
    transports.push(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
  }

  return winston.createLogger({
    level: IS_PRODUCTION ? 'info' : 'debug',
    format: logFormat,
    transports,
    // Handle uncaught exceptions and rejections
    exceptionHandlers: [
      new winston.transports.File({ filename: path.join(LOG_DIR, 'exceptions.log') })
    ],
    rejectionHandlers: [
      new winston.transports.File({ filename: path.join(LOG_DIR, 'rejections.log') })
    ]
  });
};

// Enhanced rate limiting with different tiers
const createRateLimiters = () => {
  // General API rate limiter
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: IS_PRODUCTION ? 100 : 1000, // Stricter in production
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health' || req.path === '/';
    }
  });

  // Stricter rate limiter for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: IS_PRODUCTION ? 5 : 50, // Very strict for auth
    message: {
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  return { generalLimiter, authLimiter };
};

// Enhanced multer configuration with better security
const createMulterConfig = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      // More secure filename generation
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      cb(null, `${timestamp}-${random}-${sanitizedName}`);
    },
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf'];
    
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      console.warn(`⚠️ Rejected file: ${file.originalname} (Mimetype: ${file.mimetype})`);
      const error = new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      cb(error);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // Reduced to 10MB for security
      files: 6,
      fieldSize: 1024 * 1024, // 1MB
    },
  });
};

// Smart upload middleware that only processes when needed
const createSmartUploadMiddleware = (upload: multer.Multer, fieldName: string, maxCount: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.get('Content-Type');
    const method = req.method;
    
    // Skip upload processing for GET, DELETE requests or non-multipart requests
    if (
      (method === 'GET' || method === 'DELETE') ||
      (!contentType || !contentType.includes('multipart/form-data'))
    ) {
      return next();
    }
    
    // Apply upload middleware for relevant requests
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        const logger = req.app.get('logger');
        logger.error('Multer error:', { error: err.message, code: err.code });
        
        let errorMessage = 'File upload failed';
        let statusCode = 400;
        
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            errorMessage = 'File size too large (max 10MB)';
            break;
          case 'LIMIT_FILE_COUNT':
            errorMessage = `Too many files (max ${maxCount})`;
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            errorMessage = `Unexpected field name (expected '${fieldName}')`;
            break;
          case 'INVALID_FILE_TYPE':
            errorMessage = 'Invalid file type';
            break;
        }
        
        return res.status(statusCode).json({ 
          success: false,
          message: errorMessage, 
          error: err.message 
        });
      }
      next();
    });
  };
};

// Health check endpoint
const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
};

// Graceful shutdown handler
const setupGracefulShutdown = (server: any, logger: winston.Logger) => {
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    server.close(async (err: any) => {
      if (err) {
        logger.error('Error during server shutdown:', err);
        process.exit(1);
      }
      
      try {
        await db.sequelize.close();
        logger.info('Database connection closed.');
        logger.info('Graceful shutdown completed.');
        process.exit(0);
      } catch (error) {
        logger.error('Error closing database connection:', error);
        process.exit(1);
      }
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

// Main application setup
async function createApp(): Promise<Express> {
  // Create required directories
  await createRequiredDirectories();
  
  // Initialize logger
  const logger = createLogger();
  
  // Create Express app
  const app: Express = express();
  
  // Store logger in app for access in middlewares
  app.set('logger', logger);
  
  // Trust proxy configuration
  if (IS_PRODUCTION) {
    app.set('trust proxy', 1);
  } else {
    app.set('trust proxy', 'loopback');
  }
  
  // Security and performance middleware
  app.use(helmet({
    contentSecurityPolicy: IS_PRODUCTION ? undefined : false, // Disable CSP in development
    crossOriginEmbedderPolicy: false // Allow file serving
  }));
  
  app.use(compression()); // Add compression for better performance
  
  // Body parsing middleware with security limits
  app.use(express.json({ 
    limit: IS_PRODUCTION ? '10mb' : '50mb' // Stricter limits in production
  }));
  app.use(express.urlencoded({ 
    extended: true, 
    limit: IS_PRODUCTION ? '10mb' : '50mb' 
  }));
  
  // CORS configuration
  // const corsOptions = {
  //   origin: IS_PRODUCTION ? process.env.ALLOWED_ORIGINS?.split(',') : true,
  //   credentials: true,
  //   optionsSuccessStatus: 200
  // };
  app.use(cors());
  
  // HTTP request logging
  app.use(morgan('combined', { 
    stream: { write: (message: string) => logger.info(message.trim()) },
    skip: (req, res) => res.statusCode < 400 && IS_PRODUCTION // Only log errors in production
  }));
  
  // Rate limiting
  const { generalLimiter, authLimiter } = createRateLimiters();
  app.use(generalLimiter);
  
  // Static file serving with caching
  const staticOptions = {
    maxAge: IS_PRODUCTION ? '1d' : '0', // Cache for 1 day in production
    etag: true,
    lastModified: true
  };
  
  app.use('/compressed', express.static(COMPRESSED_DIR, staticOptions));
  app.use('/uploads', express.static(UPLOAD_DIR, staticOptions));
  
  // Multer setup
  const upload = createMulterConfig();
  const shopUploadMiddleware = createSmartUploadMiddleware(upload, 'photos', 6);
  const storeUploadMiddleware = createSmartUploadMiddleware(upload, 'photos', 5);
  
  // Health check endpoint
  app.get('/health', healthCheck);
  
  // Swagger documentation
  try {
    // await createSwaggerFile();
    const swaggerDocument = require('./src/routes/swaggerSchema/swagger.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('📚 Swagger documentation available at /api-docs');
  } catch (error) {
    console.warn('⚠️ Swagger documentation setup failed:', error);
  }
  
  // Main route
  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'API Server is running',
      version: process.env.npm_package_version || '1.0.0',
      environment: NODE_ENV,
      documentation: '/api-docs'
    });
  });
  
  // API Routes with proper grouping
  // Auth routes with stricter rate limiting
  app.use('/api/auth', authLimiter, authRouter);
  
  // Public routes (less strict rate limiting)
  app.use('/api/cart', cartRouter);
  app.use('/api/orders', orderRouter);
  app.use('/api/payment', paymentRouter);
  app.use('/api/utile', utileRouter);
  app.use('/api/users', userRouter);
  app.use('/api/articles', articleRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/comments', commentRouter);
  app.use('/api/promotions', promotionRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/translations', translationRouter);
  app.use('/api/packages', packageRouter);
  app.use('/api/shipping', shippingRouter);
  app.use('/api/sizes', sizeRouter);
  app.use('/api/taxes', taxRouter);
  app.use('/api/returns', returnRouter);
  
  // Admin routes (could add admin middleware here)
  app.use('/api/admin/users', usersRouter);
  app.use('/api/admin/orders', ordersRouter);
  app.use('/api/admin/permissions', permissionsRouter);
  app.use('/api/admin/roles', rolesRouter);
  app.use('/api/admin/subcategories', subcategoriesRouter);
  app.use('/api/admin/inventory', dashboardRouter);
  app.use('/api/admin/audit-logs', auditLogRouter);
  app.use('/api/admin/user-sessions', userSessionRouter);
  
  // User-specific routes (require authentication)
  app.use('/api/favorites', favoriteRouter);
  
  // Routes with file upload capabilities
  app.use('/api/shop', shopUploadMiddleware, shopMiddleWare, shopRouter);
  app.use('/api/store', storeUploadMiddleware, storeMiddleWear, storeRouter);
  
  // 404 handler
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      timestamp: new Date().toISOString()
    });
  });
  
  // Enhanced error handling middleware
  app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const logger = app.get('logger');
    
    // Log error with context
    logger.error('Application error:', {
      message: error.message,
      stack: error.stack,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      body: req.method !== 'GET' ? req.body : undefined
    });
    
    // Don't leak error details in production
    const errorResponse = {
      success: false,
      message: IS_PRODUCTION ? 'Internal server error' : error.message,
      ...(error.code && { code: error.code }),
      ...(error.data && { data: error.data }),
      ...(!IS_PRODUCTION && { stack: error.stack })
    };
    
    res.status(error.statusCode || 500).json(errorResponse);
  });
  
  return app;
}

// Database initialization
async function initializeDatabase(): Promise<void> {
  try {
    if (!IS_PRODUCTION) {
      console.log('🔄 Performing database reset in development...');
      await db.sequelize.sync();
      console.log('✅ Database schema has been reset.');
      
      await seedDatabase();
      console.log('✅ Database seeded successfully.');
    } else {
      await db.sequelize.authenticate();
      console.log('✅ Database connection established.');
      
      await seedDatabase();
      // Run migrations in production instead of force sync
      // await db.sequelize.sync({ alter: true }); // Uncomment if needed
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Main server startup
async function startServer(): Promise<void> {
  try {
    // Initialize database
    await initializeDatabase();
    await createAdminUser();
    // Create app
    const app = await createApp();
    const logger = app.get('logger');
    
    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
    
    // Setup graceful shutdown
    setupGracefulShutdown(server, logger);
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
const createAdminUser = async () => {
  try {
    console.log('Creating default admin user...');

    // Check if admin user already exists
    const existingAdmin = await db.User.findOne({
      where: { email: 'admin@admin.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin', 10);

    // Create admin user
    const adminUser = await db.User.create({
      name: 'Admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      isVerified: true
    });

    console.log('Admin user created successfully:', {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });

    // Create default permissions
    const defaultPermissions = [
      'view_users', 'create_users', 'edit_users', 'delete_users',
      'view_roles', 'create_roles', 'edit_roles', 'delete_roles',
      'view_permissions', 'create_permissions', 'edit_permissions', 'delete_permissions',
      'view_categories', 'create_categories', 'edit_categories', 'delete_categories',
      'view_products', 'create_products', 'edit_products', 'delete_products',
      'view_orders', 'create_orders', 'edit_orders', 'delete_orders',
      'view_promotions', 'create_promotions', 'edit_promotions', 'delete_promotions',
      'view_analytics', 'view_audit_logs', 'manage_packages', 'manage_shipping',
      'manage_sizes', 'manage_taxes', 'manage_returns', 'manage_translations'
    ];

    // Create permissions
    for (const permissionName of defaultPermissions) {
      await db.Permission.findOrCreate({
        where: { name: permissionName },
        defaults: { name: permissionName, description: `Permission to ${permissionName.replace('_', ' ')}` }
      });
    }

    // Create admin role
    const adminRole = await db.Role.findOrCreate({
      where: { name: 'admin' },
      defaults: { 
        name: 'admin', 
        description: 'Administrator role with full access',
        isActive: true
      }
    });

    // Assign all permissions to admin role
    const allPermissions = await db.Permission.findAll();
    await adminRole[0].setPermissions(allPermissions);

    // Assign admin role to admin user
    await adminUser.setRoles([adminRole[0]]);

    console.log('Default admin user setup completed successfully!');
    console.log('Login credentials:');
    console.log('Email: admin@admin.com');
    console.log('Password: admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
// Start the application
startServer();