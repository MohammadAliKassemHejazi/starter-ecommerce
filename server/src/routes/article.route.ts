import express, { Express } from 'express';
import articlesController from "../controllers/article.controller";
import { protectedRoutes } from "../middlewares";


  const router = express.Router();
  router.get(
    "/",
    articlesController.handleGetArticles
  );

  router.get(
    "/get",
    articlesController.handleGetArticleById
  );

  router.get(
    "/get/author",
    articlesController.handleGetByAuthor
  );

  router.post(
    "/create",
    articlesController.handleCreate
  );
  router.patch(
    "/update/:id",
    articlesController.handleUpdate
  );
  router.delete(
    "/delete/:id",

    articlesController.handleDelete
  );

  // routes want to protect
  const Routes  = [
    "/api/articles/get",
    "/api/articles",
    "/api/articles/get/author",
    "/api/articles/create",
    "/api/articles/update/:id",
    "/api/articles/delete/:id",
  ];

  // function add hook onRequest -> protectedRoutes(appInstance, Routes you want to protect)
protectedRoutes(router, Routes);


export default router;
