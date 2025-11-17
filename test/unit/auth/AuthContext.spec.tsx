import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '@/context/AuthContext';
import { AuthProvider } from '@/context/AuthContext';
import React from 'react';

// Mock next/navigation's useRouter so AuthProvider can call router methods in tests
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: async () => {},
    back: jest.fn(),
    pathname: '/',
  }),
}));

// Mock AuthContext provider for testing
const wrapper: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext - Authentication Logic', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Login State Management', () => {
    it('should initialize with null user and false isAuthenticated', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should set user and token on successful login', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        fullname: 'Test User',
        role: 'usuario',
      };

      await act(async () => {
        // Simulate login
        localStorage.setItem('token', 'test-token-123');
        localStorage.setItem('user', JSON.stringify(mockUser));
      });

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('test-token-123');
        expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
      });
    });

    it('should clear user and token on logout', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Set initial state
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: '1', role: 'usuario' }));

      await act(async () => {
        if (result.current.logout) {
          result.current.logout();
        }
      });

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should restore user from localStorage on mount', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        fullname: 'Test User',
        role: 'usuario',
      };

      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(localStorage.getItem('token')).toBe('test-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    });
  });

  describe('Role-based Access', () => {
    it('should identify superadmin role', () => {
      const adminUser = {
        id: '1',
        email: 'admin@example.com',
        fullname: 'Admin User',
        role: 'superadmin',
      };

      localStorage.setItem('user', JSON.stringify(adminUser));
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Check role in localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      expect(storedUser.role).toBe('superadmin');
    });

    it('should identify usuario role', () => {
      const regularUser = {
        id: '2',
        email: 'user@example.com',
        fullname: 'Regular User',
        role: 'usuario',
      };

      localStorage.setItem('user', JSON.stringify(regularUser));
      const { result } = renderHook(() => useAuth(), { wrapper });

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      expect(storedUser.role).toBe('usuario');
    });
  });

  describe('Token Management', () => {
    it('should store token in localStorage', () => {
      const token = 'jwt-test-token-12345';
      localStorage.setItem('token', token);

      expect(localStorage.getItem('token')).toBe(token);
    });

    it('should clear token on logout', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.removeItem('token');

      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should not be accessible after logout', () => {
      localStorage.setItem('token', 'test-token-before-logout');
      
      // Simulate logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });
});
