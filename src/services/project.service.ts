import { httpClient } from './http.client';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '@/types';

class ProjectService {
  async getAll(): Promise<Project[]> {
    return await httpClient.get<Project[]>('/projects');
  }

  async getById(id: string): Promise<Project> {
    return await httpClient.get<Project>(`/projects/${id}`);
  }

  async create(data: CreateProjectRequest): Promise<Project> {
    return await httpClient.post<Project>('/projects', data);
  }

  async update(id: string, data: UpdateProjectRequest): Promise<Project> {
    return await httpClient.patch<Project>(`/projects/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return await httpClient.delete<void>(`/projects/${id}`);
  }
}

export const projectService = new ProjectService();

