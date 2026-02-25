import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';
import paypalService from '../services/paypal.service';
import { ResponseFormatter } from '../utils/responseFormatter';

const router = Router();

// Create PayPal order
router.post(
  '/create-order',
  [
    body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('currency')
      .optional()
      .isString()
      .withMessage('Currency must be a string')
      .isLength({ min: 3, max: 3 })
      .withMessage('Currency must be 3 characters'),
  ],
  validate([
    body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('currency')
      .optional()
      .isString()
      .withMessage('Currency must be a string')
      .isLength({ min: 3, max: 3 })
      .withMessage('Currency must be 3 characters'),
  ]),
  async (req: Request, res: Response) => {
    try {
      const { amount, currency = 'USD' } = req.body;

      const result = await paypalService.createOrder(amount, currency);

      if (result.success) {
        return ResponseFormatter.success(
          res,
          {
            orderId: result.orderId,
            approvalUrl: result.approvalUrl,
          },
          'PayPal order created successfully',
        );
      } else {
        return ResponseFormatter.error(res, 'Failed to create PayPal order', 400);
      }
    } catch (error) {
      console.error('PayPal create order error:', error);
      return ResponseFormatter.error(res, 'Internal server error', 500);
    }
  },
);

// Capture PayPal order
router.post(
  '/capture-order',
  validate([body('orderId').isString().withMessage('Order ID is required').notEmpty().withMessage('Order ID cannot be empty')]),
  async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;

      const result = await paypalService.captureOrder(orderId);

      if (result.success) {
        return ResponseFormatter.success(
          res,
          {
            orderId: result.orderId,
            status: result.status,
            paymentId: result.paymentId,
            amount: result.amount,
            currency: result.currency,
          },
          'PayPal order captured successfully',
        );
      } else {
        return ResponseFormatter.error(res, 'Failed to capture PayPal order', 400);
      }
    } catch (error) {
      console.error('PayPal capture order error:', error);
      return ResponseFormatter.error(res, 'Internal server error', 500);
    }
  },
);

// Get PayPal order details
router.get('/order/:orderId', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const result = await paypalService.getOrderDetails(orderId);

    if (result.success) {
      return ResponseFormatter.success(res, result.order, 'PayPal order details retrieved successfully');
    } else {
      return ResponseFormatter.error(res, 'Failed to get PayPal order details', 400);
    }
  } catch (error) {
    console.error('PayPal get order error:', error);
    return ResponseFormatter.error(res, 'Internal server error', 500);
  }
});

export default router;
