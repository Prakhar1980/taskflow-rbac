import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../services/AuthService';
import { AppError } from '../utils/AppError';

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);
      res.status(StatusCodes.CREATED).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError('Refresh token is required', StatusCodes.BAD_REQUEST);
      }
      const result = await this.authService.refresh(refreshToken);
      res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Please log in to continue', StatusCodes.UNAUTHORIZED);
      }
      await this.authService.logout(req.user.id);
      res.status(StatusCodes.OK).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Please log in to continue', StatusCodes.UNAUTHORIZED);
      }
      res.status(StatusCodes.OK).json({ success: true, data: { user: req.user } });
    } catch (error) {
      next(error);
    }
  };
}
