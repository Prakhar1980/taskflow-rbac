import { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, StatusCodes.NOT_FOUND));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err instanceof AppError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err instanceof AppError ? err.message : 'Internal server error';

  logger.error(message, {
    stack: err.stack,
    statusCode
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.nodeEnv !== 'production' ? { stack: err.stack } : {})
  });
};
