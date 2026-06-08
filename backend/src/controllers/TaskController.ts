import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TaskService } from '../services/TaskService';
import { AppError } from '../utils/AppError';

export class TaskController {
  constructor(private readonly taskService = new TaskService()) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Please log in to continue', StatusCodes.UNAUTHORIZED);
      const task = await this.taskService.create(req.body, req.user);
      res.status(StatusCodes.CREATED).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Please log in to continue', StatusCodes.UNAUTHORIZED);
      const result = await this.taskService.findAll(
        {
          page: Number(req.query.page ?? 1),
          limit: Number(req.query.limit ?? 10),
          search: req.query.search as string | undefined,
          status: req.query.status as never,
          priority: req.query.priority as never
        },
        req.user
      );
      res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Please log in to continue', StatusCodes.UNAUTHORIZED);
      const task = await this.taskService.findById(String(req.params.id), req.user);
      res.status(StatusCodes.OK).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Please log in to continue', StatusCodes.UNAUTHORIZED);
      const task = await this.taskService.update(String(req.params.id), req.body, req.user);
      res.status(StatusCodes.OK).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Please log in to continue', StatusCodes.UNAUTHORIZED);
      await this.taskService.delete(String(req.params.id), req.user);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };
}
