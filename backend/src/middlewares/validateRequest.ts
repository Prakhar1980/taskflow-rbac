import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError';

export const validateRequest = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((error) => error.msg)
      .join(', ');
    return next(new AppError(message, StatusCodes.BAD_REQUEST));
  }

  next();
};
