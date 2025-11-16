export type ProjectStatus = 'pending' | 'in-progress' | 'completed';

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    fullname: string;
  };
  tasks?: Array<{
    id: string;
    title: string;
    status: string;
  }>;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  status?: ProjectStatus;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  status?: ProjectStatus;
}

