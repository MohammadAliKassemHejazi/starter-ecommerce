import express from 'express';
import { storeController } from '../controllers/index';
import { protectedRoutes } from '../middlewares';

const router = express.Router();

// Defined routes that require authentication/authorization
const Routes = [
  '/delete/:id',
  '/create',
  '/update',
  '/getall/user',
  '/getall/user/filter',
  '/update/image'
];

// Apply protection middleware to the specific routes listed above
protectedRoutes(router, Routes);

// --- Store Management Routes ---

// Create a new store (includes image processing via middleware upstream)
router.post('/create', storeController.handleCreateStore);

// Update store metadata
router.post('/update', storeController.handleUpdate);

// Update store images specifically
router.patch('/update/image', storeController.handleUpdateImages);

// Delete a store by ID
router.delete('/delete/:id', storeController.handleDelete);

// --- Data Fetching Routes ---

// Get a single store by ID (Public or Protected depending on implementation)
router.get('/get', storeController.handelGetSingleItem);

// Get all stores globally
router.get('/getall', storeController.handelGetAllStores);

// Get all stores belonging to the logged-in user
router.get('/getall/user', storeController.handelGetAllStoresForUser);

// Get all stores for the logged-in user with filtering and pagination
router.get('/getall/user/filter', storeController.handleGetAllStoresForUserwithFilter);

export default router;