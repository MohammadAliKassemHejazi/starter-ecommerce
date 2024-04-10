// Import necessary modules
import express, { Express, Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import winston from 'winston';
import { swaggerOption } from './src/config/swagger';
import { authRouter, userRouter, articleRouter ,shopRouter } from './src/routes';
import { CustomError } from './src/utils/customError';
import config from './src/config/config';
import db from './src/models';
import multer from 'multer';



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

// Apply middleware
app.use(helmet()); // Security middleware
app.use(express.json());
app.use(express.urlencoded()); 

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
    cb(null, file.originalname); // Use the original filename for uploaded files
  }
});

const upload = multer({ storage: storage });

// Routes
app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('SERVER');
    next();
});
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/articles', articleRouter);
app.use('/api/shop', upload.array('images', 5),shopRouter);


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
const server: Server = app.listen(Number(PORT), () => {
    logger.info(`Server is running on port ${PORT} in ${app.get('env')} mode`);
});

// Sync the database
if (process.env.NODE_ENV !== 'production') {
    db.sequelize.sync({ force: true }).then(() => {
        logger.info('Database synced');
    }).catch((err: Error) => {
        logger.error('Error syncing database:', err);
    });
}
