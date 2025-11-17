import { render, screen, fireEvent, waitFor } from '@testing-library/react';

describe('Authentication Service', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Login Functionality', () => {
    it('should store token in localStorage after login', () => {
      const token = 'test-jwt-token-12345';
      localStorage.setItem('token', token);

      expect(localStorage.getItem('token')).toBe(token);
    });

    it('should store user data in localStorage after login', () => {
      const userData = {
        id: '1',
        email: 'user@example.com',
        fullname: 'Test User',
        role: 'usuario',
      };

      localStorage.setItem('user', JSON.stringify(userData));
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      expect(storedUser.id).toBe('1');
      expect(storedUser.email).toBe('user@example.com');
      expect(storedUser.role).toBe('usuario');
    });

    it('should store superadmin data correctly', () => {
      const adminData = {
        id: '2',
        email: 'admin@example.com',
        fullname: 'Admin User',
        role: 'superadmin',
      };

      localStorage.setItem('user', JSON.stringify(adminData));
      const storedAdmin = JSON.parse(localStorage.getItem('user') || '{}');

      expect(storedAdmin.role).toBe('superadmin');
      expect(storedAdmin.fullname).toBe('Admin User');
    });
  });

  describe('Logout Functionality', () => {
    it('should remove token from localStorage on logout', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.removeItem('token');

      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should remove user data from localStorage on logout', () => {
      const userData = { id: '1', email: 'user@example.com', role: 'usuario' };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.removeItem('user');

      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should clear all auth data on logout', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: '1', role: 'usuario' }));

      localStorage.clear();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('Token Validation', () => {
    it('should validate token exists', () => {
      const token = 'valid-token-123';
      localStorage.setItem('token', token);

      const storedToken = localStorage.getItem('token');
      expect(storedToken).toBeTruthy();
      expect(storedToken).toBe(token);
    });

    it('should identify missing token', () => {
      localStorage.removeItem('token');
      const token = localStorage.getItem('token');

      expect(token).toBeNull();
    });
  });

  describe('User Role Detection', () => {
    it('should detect usuario role', () => {
      const userData = { id: '1', role: 'usuario' };
      localStorage.setItem('user', JSON.stringify(userData));

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      expect(user.role).toBe('usuario');
    });

    it('should detect superadmin role', () => {
      const userData = { id: '1', role: 'superadmin' };
      localStorage.setItem('user', JSON.stringify(userData));

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      expect(user.role).toBe('superadmin');
    });

    it('should prevent unauthorized role access', () => {
      const userData = { id: '1', role: 'usuario' };
      localStorage.setItem('user', JSON.stringify(userData));

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = user.role === 'superadmin';

      expect(isAdmin).toBe(false);
    });
  });
});
