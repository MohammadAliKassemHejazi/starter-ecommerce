// Import necessary modules
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import winston from 'winston';
import { orderRouter,cartRouter,authRouter, userRouter, articleRouter ,shopRouter , storeRouter,utileRouter,paymentRouter } from './src/routes';
import { CustomError } from './src/utils/customError';
import config from './src/config/config';
import db from './src/models';
import multer, { FileFilterCallback } from 'multer';
import path from 'node:path';

// import * as  spdy from 'spdy';
// import seedDatabase from './seedDataBase';
import { CustomRequest } from 'interfaces/types/middlewares/request.middleware.types';
import { storeMiddleWear } from 'middlewares/store.middleweare';
import { shopMiddleWare } from 'middlewares/shop.middleware';
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

app.use('/compressed', express.static(path.join(__dirname, 'compressed')));

//static paths
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Apply middleware
app.use(helmet()); // Apply helmet for security headers

// Increase the request body size limit for JSON bodies
app.use(express.json({ verify: function(req : CustomRequest, res, buf) {
        if (req.path === '/api/payment/webhook') {
            req.rawBody = buf;
        }
    },limit: '50mb' }));

// Increase the request body size limit for URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
    fileSize: 50 * 1024 * 1024, 
    files: 6 
}
});
  
app.use('/compressed', express.static(path.join(__dirname, 'compressed'), {
  maxAge: '1d', // Cache for 1 day
  etag: false,  // Disable ETag headers
}));

// Routes
app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('SERVER');
    next();
});

app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payment', paymentRouter);

app.use('/api/shop', upload.array('photos', 6),shopMiddleWare , shopRouter);

app.use('/api/store', upload.array('photos', 5),storeMiddleWear,storeRouter);

app.use('/api/auth', authRouter);
app.use('/api/utile', utileRouter);
app.use('/api/users', userRouter);
app.use('/api/articles', articleRouter);


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
// seedDatabase()
  logger.info(`Server is running on port ${PORT} in ${app.get('env')} mode`);
  
});

// to enable http2


// Sync the database
if (process.env.NODE_ENV !== 'production') {

  db.sequelize.sync().then(() => {
        logger.info('Database synced');
        // seedDatabase()
    }).catch((err: Error) => {
        logger.error('Error syncing database:', err);
    });
}


