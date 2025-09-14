import express from 'express';
import { getTranslations, createTranslation, updateTranslation, deleteTranslation, getTranslationsByRecord } from '../controllers/translation.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/permission.middleware';

const router = express.Router();

// Get translations by record (public for frontend)
router.get('/record/:model/:recordId', getTranslationsByRecord);

// All other routes require authentication
router.use(verifyToken);

// Get all translations
router.get('/', checkPermission('manage_translations'), getTranslations);

// Create translation
router.post('/', checkPermission('manage_translations'), createTranslation);

// Update translation
router.put('/:id', checkPermission('manage_translations'), updateTranslation);

// Delete translation
router.delete('/:id', checkPermission('manage_translations'), deleteTranslation);

export default router;
