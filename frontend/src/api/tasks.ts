import { api, ApiResponse, Task, TaskListResponse } from './client';

export type TaskInput = {
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
};

export type TaskQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
};

export const taskApi = {
  async list(params: TaskQuery) {
    const response = await api.get<ApiResponse<TaskListResponse>>('/tasks', { params });
    return response.data.data;
  },

  async get(id: string) {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

  async create(input: TaskInput) {
    const response = await api.post<ApiResponse<Task>>('/tasks', input);
    return response.data.data;
  },

  async update(id: string, input: TaskInput) {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, input);
    return response.data.data;
  },

  async delete(id: string) {
    await api.delete(`/tasks/${id}`);
  }
};
