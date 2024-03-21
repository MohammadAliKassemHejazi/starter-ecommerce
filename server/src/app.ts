import express, { Express, Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerOption } from './config/swagger';
import { authRouter, userRouter, articleRouter } from './routes';
import { CustomError } from './utils/customError';
const bodyParser = require("body-parser");

export const App = (options: any): Express => {
    const app: Express = express();

    // Parse JSON bodies
    app.use(bodyParser.json());

    // Enable CORS
    app.use((req, res, next) => {
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
    app.get('/', (req: Request, res: Response) => {
        res.send('SERVER');
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

    return app;
};
