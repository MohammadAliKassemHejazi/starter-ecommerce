import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerOption } from './config/swagger';
import { authRouter, userRouter, articleRouter } from './routes';
import { CustomError } from './utils/customError';

const App = (options: any): Express => {
    const app: Express = express();

    // Enable CORS
    app.use(cors({
        origin: (origin:any, callback:any) => {
            // Allow requests from localhost
            if (!origin || origin.includes('localhost')) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    }));

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

export default App;
