import { Request, Response, NextFunction } from 'express';

// Extend Express Response interface to allow overriding json/send
declare global {
  namespace Express {
    interface Response {
      originalJson: (body: any) => Response;
    }
  }
}

/**
 * Middleware to standardize API responses.
 * Wraps all responses in { success: true, message: 'Success', data: ... }
 * if they are not already in that format.
 */
export const responseStandardizer = (req: Request, res: Response, next: NextFunction) => {
  // Store the original .json method
  const originalJson = res.json;

  // Override .json
  res.json = function (body: any): Response {
    // If response already has error status or is an error response, let it pass (or handled by error middleware)
    if (res.statusCode >= 400) {
      // If it matches our standard error format { success: false, ... }, leave it.
      // Otherwise, we might want to wrap it too, but usually error middleware handles formatting.
      // For now, let's assume errors are handled by the error middleware which emits standard format.
      return originalJson.call(this, body);
    }

    // Check if the body is already in standard format
    // Standard format: { success: boolean, message: string, data?: any }
    const isStandard =
      body &&
      typeof body === 'object' &&
      'success' in body &&
      'message' in body;

    if (isStandard) {
      return originalJson.call(this, body);
    }

    // Wrap non-standard responses
    // Cases:
    // 1. body is null/undefined
    // 2. body is the data object directly (e.g. { product: ... } or [ ... ])

    const standardResponse = {
      success: true,
      message: 'Success',
      data: body
    };

    return originalJson.call(this, standardResponse);
  };

  next();
};
