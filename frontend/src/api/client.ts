import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1';

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const response = await axios.post<ApiResponse<AuthPayload>>(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: rotatedRefreshToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', rotatedRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export type User = {
  id: string;
  email: string;
  role: 'user' | 'admin';
};

export type AuthPayload = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
};

export type TaskListResponse = {
  items: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
