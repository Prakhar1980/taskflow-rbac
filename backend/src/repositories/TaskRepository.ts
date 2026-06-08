import { FilterQuery, Types } from 'mongoose';
import { ITask, Task, TaskDocument, TaskPriority, TaskStatus } from '../models/Task';

export type TaskListQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
};

export class TaskRepository {
  create(data: Pick<ITask, 'title' | 'description' | 'status' | 'priority' | 'createdBy'>): Promise<TaskDocument> {
    return Task.create(data);
  }

  async findAll(filter: FilterQuery<ITask>, query: TaskListQuery) {
    const skip = (query.page - 1) * query.limit;
    const mongoFilter: FilterQuery<ITask> = { ...filter };

    if (query.search) {
      mongoFilter.$text = { $search: query.search };
    }
    if (query.status) {
      mongoFilter.status = query.status;
    }
    if (query.priority) {
      mongoFilter.priority = query.priority;
    }

    const [items, total] = await Promise.all([
      Task.find(mongoFilter)
        .populate('createdBy', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .exec(),
      Task.countDocuments(mongoFilter)
    ]);

    return {
      items,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit)
      }
    };
  }

  findById(id: string, ownerId?: string): Promise<TaskDocument | null> {
    const filter: FilterQuery<ITask> = { _id: new Types.ObjectId(id) };
    if (ownerId) filter.createdBy = new Types.ObjectId(ownerId);
    return Task.findOne(filter).populate('createdBy', 'name email role').exec();
  }

  update(id: string, data: Partial<ITask>, ownerId?: string): Promise<TaskDocument | null> {
    const filter: FilterQuery<ITask> = { _id: new Types.ObjectId(id) };
    if (ownerId) filter.createdBy = new Types.ObjectId(ownerId);
    return Task.findOneAndUpdate(filter, data, { new: true, runValidators: true })
      .populate('createdBy', 'name email role')
      .exec();
  }

  delete(id: string, ownerId?: string): Promise<TaskDocument | null> {
    const filter: FilterQuery<ITask> = { _id: new Types.ObjectId(id) };
    if (ownerId) filter.createdBy = new Types.ObjectId(ownerId);
    return Task.findOneAndDelete(filter).exec();
  }
}
