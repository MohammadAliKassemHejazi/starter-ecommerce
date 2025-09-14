import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/customError';
import { ResponseFormatter } from '../utils/responseFormatter';
import { logger } from '../config/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Custom application errors
  if (error instanceof CustomError) {
    return ResponseFormatter.error(
      res,
      error.message,
      error.statusCode,
      error.data ? [error.data] : undefined
    );
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return ResponseFormatter.validationError(res, [error.message]);
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return ResponseFormatter.unauthorized(res, 'Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    return ResponseFormatter.unauthorized(res, 'Token expired');
  }

  // Database errors
  if (error.name === 'SequelizeValidationError') {
    const errors = (error as any).errors.map((err: any) => ({
      field: err.path,
      message: err.message
    }));
    return ResponseFormatter.validationError(res, errors);
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return ResponseFormatter.error(
      res,
      'A record with this information already exists',
      409
    );
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return ResponseFormatter.error(
      res,
      'Referenced record does not exist',
      400
    );
  }

  // Multer errors
  if (error.name === 'MulterError') {
    let message = 'File upload error';
    if ((error as any).code === 'LIMIT_FILE_SIZE') {
      message = 'File too large';
    } else if ((error as any).code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files';
    }
    return ResponseFormatter.error(res, message, 400);
  }

  // Default server error
  return ResponseFormatter.error(
    res,
    process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    500
  );
};

export const notFoundHandler = (req: Request, res: Response) => {
  ResponseFormatter.notFound(res, `Route ${req.originalUrl} not found`);
};
