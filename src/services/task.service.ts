import { httpClient } from './http.client';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types';

class TaskService {
  async getAll(): Promise<Task[]> {
    return await httpClient.get<Task[]>('/tasks');
  }

  async getById(id: string): Promise<Task> {
    return await httpClient.get<Task>(`/tasks/${id}`);
  }

  async getByProject(projectId: string): Promise<Task[]> {
    return await httpClient.get<Task[]>(`/tasks/project/${projectId}`);
  }

  async create(data: CreateTaskRequest): Promise<Task> {
    return await httpClient.post<Task>('/tasks', data);
  }

  async update(id: string, data: UpdateTaskRequest): Promise<Task> {
    return await httpClient.patch<Task>(`/tasks/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return await httpClient.delete<void>(`/tasks/${id}`);
  }
}

export const taskService = new TaskService();