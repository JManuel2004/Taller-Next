import { httpClient } from './http.client';
import type {
  User,
  UpdateUserRequest,
} from '@/types';

class UserService {
  async getAll(): Promise<User[]> {
    return await httpClient.get<User[]>('/users');
  }

  async getById(id: string): Promise<User> {
    return await httpClient.get<User>(`/users/${id}`);
  }


  async update(id: string, data: UpdateUserRequest): Promise<User> {
    return await httpClient.patch<User>(`/users/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return await httpClient.delete<void>(`/users/${id}`);
  }
}

export const userService = new UserService();
