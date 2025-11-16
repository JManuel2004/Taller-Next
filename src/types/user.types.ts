import { UserRole } from './auth.types';

export interface UpdateUserRequest {
    fullname?: string;
    email?: string;
    password?: string;  
    role?: UserRole;
  }