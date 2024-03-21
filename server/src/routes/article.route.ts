import express, { Express } from 'express';
import articlesController from "../controllers/article.controller";
import { protectedRoutes } from "../middlewares";


const router = express.Router();
    // routes want to protect
  const Routes  = [
    "/get",
    "/get/author",
    "/create",
    "/update/:id",
    "/delete/:id",
  ];

  // function add hook onRequest -> protectedRoutes(appInstance, Routes you want to protect)
protectedRoutes(router, Routes);
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




export default router;
