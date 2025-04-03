import logger from '../utils/logger.js';
import { AppError } from '../utils/customErrors.js';

// Handle 404 errors
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Central error handler
const errorHandler = (err, req, res, next) => {
  // Set default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let errorDetails = undefined;
  
  // Log the error
  if (statusCode === 500) {
    logger.error({
      path: req.path,
      method: req.method,
      error: err.stack || err.toString(),
      body: req.body
    });
  } else {
    logger.warn({
      path: req.path,
      method: req.method,
      errorType: err.constructor.name,
      message: err.message,
      statusCode
    });
  }
  
  // Handle Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation Error';
    errorDetails = Object.values(err.errors).map(error => error.message);
  }
  
  // Handle Cast Errors (malformed MongoDB IDs)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  
  // Handle Multer Errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File too large. Maximum size is 5MB.';
  }
  
  // Handle duplicate key errors
  if (err.code === 11000) {
    statusCode = 409;
    message = 'A record with this information already exists';
    
    // Try to identify the duplicate field
    const field = Object.keys(err.keyValue)[0];
    if (field) {
      message = `A record with this ${field} already exists`;
    }
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  // Rate limit error
  if (err.statusCode === 429) {
    res.set('Retry-After', err.retryAfter || 60);
  }
  
  // Send the response
  res.status(statusCode).json({
    success: false,
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    ...(errorDetails && { errors: errorDetails }),
    ...(process.env.NODE_ENV === 'development' && statusCode >= 500 && { stack: err.stack })
  });
};

export { notFoundHandler, errorHandler };