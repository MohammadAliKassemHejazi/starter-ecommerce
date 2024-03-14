import express, { Express } from 'express';
import { Server } from 'http';
import config from './src/config/config';
import db from './src/models';
import App from './src/app';

// Create an Express application
const app: Express = express();

// Initialize your application
App(app);

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
