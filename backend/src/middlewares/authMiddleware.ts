import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Role } from '../models/User';
import { AppError } from '../utils/AppError';
import { verifyAccessToken } from '../utils/jwt';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(new AppError('Please log in to continue', StatusCodes.UNAUTHORIZED));
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new AppError('Your session has expired. Please log in again', StatusCodes.UNAUTHORIZED));
  }
};

export const authorize =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Please log in to continue', StatusCodes.UNAUTHORIZED));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to access this resource', StatusCodes.FORBIDDEN));
    }

    next();
  };
