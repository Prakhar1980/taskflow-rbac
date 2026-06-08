import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../repositories/UserRepository';

export class AdminController {
  constructor(private readonly userRepository = new UserRepository()) {}

  listUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userRepository.find({});
      res.status(StatusCodes.OK).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  };
}
