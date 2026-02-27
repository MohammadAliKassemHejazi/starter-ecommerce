import express from 'express';
import { shopController, storeController, categoryController, articlesController } from '../controllers/index';
import { body, param, query } from 'express-validator';
const router = express.Router();

// Public routes that don't require authentication
// These are for guest users and public access

// Get all public stores (for home page)
router.get('/stores', async (req, res, next) => {
  try {
    const result = await storeController.handleGetAllStores(req, res, next);
    return result;
  } catch (error) {
    next(error);
  }
});

// Get public store by ID
router.get('/stores/:id', async (req, res, next) => {
  try {
    const result = await storeController.handleGetStoreById(req, res, next);
    return result;
  } catch (error) {
    next(error);
  }
});

// Get public products listing (for home page)
router.get('/products', async (req, res, next) => {
  try {
    const result = await shopController.handelgetall(req, res, next);
    return result;
  } catch (error) {
    next(error);
  }
});

// Get public product by ID
router.get('/products/:id', async (req, res, next) => {
  try {
    const result = await shopController.handleGetSingleItem(req, res, next);
    return result;
  } catch (error) {
    next(error);
  }
});

// Get public products by store
router.get('/stores/:storeId/products', async (req, res, next) => {
  try {
    const result = await shopController.getProductsByStore(req, res, next);
    return result;
  } catch (error) {
    next(error);
  }
});

// Get public categories (for navigation)
router.get('/categories', async (req, res, next) => {
  try {
    const result = await categoryController.handleFetchCategories(req, res, next);
    return result;
  } catch (error) {
    next(error);
  }
});

// Get public articles (for home page)
router.get('/articles', async (req, res, next) => {
  try {
    const result = await articlesController.handleGetArticles(req, res, next);
    return result;
  } catch (error) {
    next(error);
  }
});

router.get(
  '/get/productListing',
  [
    query('page').optional().isInt({ min: 1 }).toInt(), // Validate page
    query('pageSize').optional().isInt({ min: 1 }).toInt(), // Validate pageSize
  ],
  shopController.getProductsListing,
);

export default router;
