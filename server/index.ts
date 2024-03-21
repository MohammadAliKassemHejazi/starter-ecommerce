import express, { Express, Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import config from './src/config/config';
import db from './src/models';
import swaggerUi from 'swagger-ui-express';
import { swaggerOption } from './src/config/swagger';
import { authRouter, userRouter, articleRouter } from './src/routes';
import { CustomError } from './src/utils/customError';
const bodyParser = require("body-parser");

// Create an Express application
const app: Express = express();

// Initialize your application
app.use(bodyParser.json());

    // Enable CORS
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "OPTIONS, GET, POST, PUT, PATCH, DELETE"
        );
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        next();
    });

    // Swagger API documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOption.options));

    // Routes
    app.get('/', (req: Request, res: Response, next: NextFunction) => {
        res.send('SERVER');
        next()
    });

    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/articles', articleRouter);

    // Error handler
    app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
        const customError: CustomError = error;
        res.status(customError.statusCode || 500).json({
            error: {
                message: customError.message,
                code: customError.code,
                data: customError.data,
            }
        });
    });

// Set up the server
const PORT: string | number = config.port;
const server: Server = app.listen(Number(PORT), () => {
    console.log(`Server is running on port ${PORT}`);
});

// Sync the database
db.sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((err: Error) => {
    console.error('Error syncing database:', err);
});
