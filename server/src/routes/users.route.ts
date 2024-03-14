import express, { Express } from 'express';
import articlesController from '../controllers/article.controller';
import { protectedRoutes } from '../middlewares';
// import {
//   getArticleRouteSchema,
//   getArticleListRouteSchema,
//   createArticleRouteSchema,
//   updateArticleRouteSchema,
//   deleteArticleRouteSchema,
//   getAllArticleRouteSchema,
// } from './swaggerSchema/article.route.schema';

const articleRouter = (app: Express) => {
  const router = express.Router();

  router.get(
    '/',
    
    articlesController.handleGetArticles
  );

  router.get(
    '/get',
    
    articlesController.handleGetArticleById
  );

  router.get(
    '/get/author',
    
    articlesController.handleGetByAuthor
  );

  router.post(
    '/create',
    articlesController.handleCreate
  );

  router.patch(
    '/update/:id',
   
    articlesController.handleUpdate
  );

  router.delete(
    '/delete/:id',
    
    articlesController.handleDelete
  );

  // routes to protect
  const routesToProtect = [
    '/api/articles/get',
    '/api/articles',
    '/api/articles/get/author',
    '/api/articles/create',
    '/api/articles/update/:id',
    '/api/articles/delete/:id',
  ];

  // Add middleware to protect routes
  protectedRoutes(router, routesToProtect);

  // Register the router with the main app
  app.use('/api/articles', router);
};

export default articleRouter;
