import express from 'express';
import { getTaxRules, createTaxRule, updateTaxRule, deleteTaxRule, calculateTax } from '../controllers/tax.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/permission.middleware';

const router = express.Router();

// Get tax rules (public for tax calculation)
router.get('/', getTaxRules);

// Calculate tax (public for checkout)
router.post('/calculate', calculateTax);

// All other routes require authentication and admin permissions
router.use(verifyToken);
router.use(checkPermission('manage_taxes'));

router.post('/', createTaxRule);
router.put('/:id', updateTaxRule);
router.delete('/:id', deleteTaxRule);

export default router;
