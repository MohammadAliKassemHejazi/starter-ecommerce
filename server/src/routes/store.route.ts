import express from 'express';
import { storeController } from '../controllers/index';
import { protectedRoutes } from '../middlewares';
import upload from '../middlewares/store.middleweare';

const router = express.Router();

// Defined routes that require authentication/authorization
const Routes = [
  '/delete/:id',
  '/create',
  '/update/image/:id',
  '/getall/user',
  '/getall/user/filter',
  '/delete/image/:id'
];

// Apply protection middleware to the specific routes listed above
protectedRoutes(router, Routes);

// --- Store Management Routes ---

// Create a new store
router.post('/create', upload.array('files'), storeController.handleCreateStore);

// Update store images (Bulk addition/replacement)
router.patch('/update/image/:id', upload.array('files'), storeController.handleUpdateImages);

// Delete a specific store image
router.delete('/delete/image/:id', storeController.handleDeleteStoreImage);

// Delete a store by ID
router.delete('/delete/:id', storeController.handleDeleteStore);

// --- Data Fetching Routes ---

// Get a single store by ID
router.get('/get/:id', storeController.handleGetStoreById);

// Get all stores globally
router.get('/getall', storeController.handleGetAllStores);

// Get all stores belonging to the logged-in user
router.get('/getall/user', storeController.handleGetAllStoresForUser);

// Get all stores for the logged-in user with filtering and pagination
router.get('/getall/user/filter', storeController.handleGetAllStoresForUserWithFilter);

export default router;
