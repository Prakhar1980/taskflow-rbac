import { api, ApiResponse, AuthPayload, User } from './client';

export type LoginValues = {
  email: string;
  password: string;
};

export type RegisterValues = LoginValues & {
  name: string;
  role?: 'user' | 'admin';
};

export const authApi = {
  async login(values: LoginValues) {
    const response = await api.post<ApiResponse<AuthPayload>>('/auth/login', values);
    return response.data.data;
  },

  async register(values: RegisterValues) {
    const response = await api.post<ApiResponse<AuthPayload>>('/auth/register', values);
    return response.data.data;
  },

  async me() {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data.data.user;
  },

  async logout() {
    await api.post('/auth/logout');
  }
};
