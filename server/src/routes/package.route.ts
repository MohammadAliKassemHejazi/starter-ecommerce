import express from 'express';
import { getPackages, getPackageById, createPackage, updatePackage, deletePackage, assignPackageToUser } from '../controllers/package.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/permission.middleware';

const router = express.Router();

// Get packages (public)
router.get('/', getPackages);

// Get package by ID (public)
router.get('/:id', getPackageById);

// All other routes require authentication
router.use(verifyToken);

// Create package (admin only)
router.post('/', checkPermission('manage_packages'), createPackage);

// Update package (admin only)
router.put('/:id', checkPermission('manage_packages'), updatePackage);

// Delete package (admin only)
router.delete('/:id', checkPermission('manage_packages'), deletePackage);

// Assign package to user (admin only)
router.post('/assign', checkPermission('manage_packages'), assignPackageToUser);

export default router;
