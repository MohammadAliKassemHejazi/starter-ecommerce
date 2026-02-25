import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

// Generic validation middleware
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  };
};

// Common validation rules
export const commonValidations = {
  email: body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),

  password: body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  name: body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  phone: body('phone').optional().trim().isMobilePhone('any').withMessage('Please provide a valid phone number'),

  uuid: (field: string) => body(field).isUUID().withMessage(`${field} must be a valid UUID`),

  positiveNumber: (field: string) => body(field).isFloat({ min: 0 }).withMessage(`${field} must be a positive number`),

  requiredString: (field: string, minLength: number = 1) =>
    body(field).trim().isLength({ min: minLength }).withMessage(`${field} is required and must be at least ${minLength} characters`),

  optionalString: (field: string, maxLength: number = 255) =>
    body(field).optional().trim().isLength({ max: maxLength }).withMessage(`${field} must not exceed ${maxLength} characters`),
};
