export type UserRole = 'superadmin' | 'usuario';

export interface User {
  id: string;
  email: string;
  fullname: string;
  role: UserRole;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  fullname: string;
  role: UserRole;
  isActive: boolean;
  token: string;
}

export interface CheckAuthResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

/**
 * Error de autenticación del backend
 */
export interface AuthError {
  message: string;
  error: string;
  statusCode: number;
}
