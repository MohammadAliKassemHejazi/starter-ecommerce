import express, { Express } from 'express';
import articlesController from "../controllers/article.controller";
import { protectedRoutes } from "../middlewares";

const articleRouter = async (app: Express) => {
  // route api app.method("path", {option}, handler)
  const router = express.Router();
  app.get(
    "/",
    articlesController.handleGetArticles
  );

  app.get(
    "/get",
    articlesController.handleGetArticleById
  );

  app.get(
    "/get/author",
    articlesController.handleGetByAuthor
  );

  app.post(
    "/create",
    articlesController.handleCreate
  );
  app.patch(
    "/update/:id",
    articlesController.handleUpdate
  );
  app.delete(
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
  protectedRoutes(app, Routes);
};

export default articleRouter;
