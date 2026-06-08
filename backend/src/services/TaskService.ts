import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { Role } from '../models/User';
import { ITask, TaskPriority, TaskStatus } from '../models/Task';
import { TaskListQuery, TaskRepository } from '../repositories/TaskRepository';
import { AppError } from '../utils/AppError';
import { cache } from '../utils/cache';

type AuthUser = {
  id: string;
  role: Role;
};

type TaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
};

export class TaskService {
  constructor(private readonly taskRepository = new TaskRepository()) {}

  async create(input: TaskInput, user: AuthUser) {
    const task = await this.taskRepository.create({
      title: input.title,
      description: input.description ?? '',
      status: input.status ?? 'todo',
      priority: input.priority ?? 'medium',
      createdBy: new Types.ObjectId(user.id)
    });
    await cache.delByPattern(`tasks:${user.role}:${user.id}:*`);
    await cache.delByPattern('tasks:admin:*');
    return task;
  }

  async findAll(query: TaskListQuery, user: AuthUser) {
    const ownerFilter = user.role === 'admin' ? {} : { createdBy: new Types.ObjectId(user.id) };
    const cacheKey = `tasks:${user.role}:${user.id}:${JSON.stringify(query)}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const result = await this.taskRepository.findAll(ownerFilter, query);
    await cache.set(cacheKey, result);
    return result;
  }

  async findById(id: string, user: AuthUser) {
    this.ensureValidObjectId(id);
    const task = await this.taskRepository.findById(id, user.role === 'admin' ? undefined : user.id);
    if (!task) {
      throw new AppError('Task was not found or is not available to this user', StatusCodes.NOT_FOUND);
    }
    return task;
  }

  async update(id: string, input: Partial<ITask>, user: AuthUser) {
    this.ensureValidObjectId(id);
    const task = await this.taskRepository.update(id, input, user.role === 'admin' ? undefined : user.id);
    if (!task) {
      throw new AppError('Task was not found or is not available to this user', StatusCodes.NOT_FOUND);
    }
    await cache.delByPattern(`tasks:${user.role}:${user.id}:*`);
    await cache.delByPattern('tasks:admin:*');
    return task;
  }

  async delete(id: string, user: AuthUser) {
    this.ensureValidObjectId(id);
    const task = await this.taskRepository.delete(id, user.role === 'admin' ? undefined : user.id);
    if (!task) {
      throw new AppError('Task was not found or is not available to this user', StatusCodes.NOT_FOUND);
    }
    await cache.delByPattern(`tasks:${user.role}:${user.id}:*`);
    await cache.delByPattern('tasks:admin:*');
  }

  private ensureValidObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Task id is not valid', StatusCodes.BAD_REQUEST);
    }
  }
}
