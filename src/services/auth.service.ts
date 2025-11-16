import { httpClient } from './http.client';
import { LoginRequest, LoginResponse, CheckAuthResponse, RegisterRequest, RegisterResponse, User } from '@/types';

class AuthService {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await httpClient.post<RegisterResponse>('/auth/register', data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await httpClient.post<LoginResponse>('/auth/login', credentials);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.id,
          email: response.email,
          fullname: response.fullname,
          role: response.role,
          isActive: response.isActive,
        }));
        
        document.cookie = `token=${response.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async checkAuth(): Promise<CheckAuthResponse> {
    try {
      const response = await httpClient.get<CheckAuthResponse>('/auth/check');
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        document.cookie = `token=${response.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
      }
      
      return response;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }

  getUserFromStorage(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  getTokenFromStorage(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
}

export const authService = new AuthService();
