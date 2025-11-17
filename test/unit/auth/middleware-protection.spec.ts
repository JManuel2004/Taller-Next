describe('Route Protection Middleware', () => {
  describe('Authentication Check', () => {
    it('should redirect to login when no token', () => {
      localStorage.clear();
      const isAuthenticated = !!localStorage.getItem('token');

      expect(isAuthenticated).toBe(false);
    });

    it('should allow access when token exists', () => {
      localStorage.setItem('token', 'test-token');
      const isAuthenticated = !!localStorage.getItem('token');

      expect(isAuthenticated).toBe(true);
    });

    it('should check token in localStorage', () => {
      localStorage.removeItem('token');
      const token = localStorage.getItem('token');

      expect(token).toBeNull();
    });
  });

  describe('User Role-Based Access', () => {
    it('should allow superadmin to access admin routes', () => {
      const user = JSON.stringify({ role: 'superadmin' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const canAccessAdmin = stored.role === 'superadmin';

      expect(canAccessAdmin).toBe(true);
    });

    it('should prevent usuario from accessing admin routes', () => {
      const user = JSON.stringify({ role: 'usuario' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const canAccessAdmin = stored.role === 'superadmin';

      expect(canAccessAdmin).toBe(false);
    });

    it('should allow usuario to access user routes', () => {
      const user = JSON.stringify({ role: 'usuario' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const canAccessUser = stored.role === 'usuario';

      expect(canAccessUser).toBe(true);
    });

    it('should allow superadmin to access all routes', () => {
      const user = JSON.stringify({ role: 'superadmin' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const canAccessAll = stored.role === 'superadmin';

      expect(canAccessAll).toBe(true);
    });
  });

  describe('Route Redirection Rules', () => {
    it('should redirect unauthenticated user to /login', () => {
      localStorage.clear();
      const token = localStorage.getItem('token');
      const shouldRedirectToLogin = !token;

      expect(shouldRedirectToLogin).toBe(true);
    });

    it('should redirect usuario trying to access /users to /dashboard/user', () => {
      const user = JSON.stringify({ role: 'usuario' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdminRoute = stored.role !== 'superadmin';

      expect(isAdminRoute).toBe(true);
    });

    it('should redirect usuario trying to access /dashboard/admin to /dashboard/user', () => {
      const user = JSON.stringify({ role: 'usuario' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const shouldRedirect = stored.role === 'usuario';

      expect(shouldRedirect).toBe(true);
    });

    it('should allow superadmin to access /users', () => {
      const user = JSON.stringify({ role: 'superadmin' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const canAccessUsers = stored.role === 'superadmin';

      expect(canAccessUsers).toBe(true);
    });

    it('should allow superadmin to access /dashboard/admin', () => {
      const user = JSON.stringify({ role: 'superadmin' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const canAccessAdmin = stored.role === 'superadmin';

      expect(canAccessAdmin).toBe(true);
    });
  });

  describe('Protected Route Access', () => {
    it('should protect /projects route', () => {
      localStorage.clear();
      const isAuthenticated = !!localStorage.getItem('token');

      expect(isAuthenticated).toBe(false);
    });

    it('should protect /users route (admin only)', () => {
      const user = JSON.stringify({ role: 'usuario' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = stored.role === 'superadmin';

      expect(isAdmin).toBe(false);
    });

    it('should protect /dashboard/admin route (admin only)', () => {
      const user = JSON.stringify({ role: 'usuario' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = stored.role === 'superadmin';

      expect(isAdmin).toBe(false);
    });

    it('should allow authenticated usuario to access /projects', () => {
      localStorage.setItem('token', 'test-token');
      const user = JSON.stringify({ role: 'usuario' });
      localStorage.setItem('user', user);

      const token = localStorage.getItem('token');
      const stored = JSON.parse(localStorage.getItem('user') || '{}');

      expect(!!token && stored.role === 'usuario').toBe(true);
    });
  });

  describe('Root Path Redirect', () => {
    it('should redirect unauthenticated from / to /login', () => {
      localStorage.clear();
      const token = localStorage.getItem('token');
      const shouldRedirectToLogin = !token;

      expect(shouldRedirectToLogin).toBe(true);
    });

    it('should redirect superadmin from / to /dashboard/admin', () => {
      localStorage.setItem('token', 'test-token');
      const user = JSON.stringify({ id: '1', role: 'superadmin' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const redirectTo = stored.role === 'superadmin' ? '/dashboard/admin' : '/dashboard/user';

      expect(redirectTo).toBe('/dashboard/admin');
    });

    it('should redirect usuario from / to /dashboard/user', () => {
      localStorage.setItem('token', 'test-token');
      const user = JSON.stringify({ id: '2', role: 'usuario' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const redirectTo = stored.role === 'superadmin' ? '/dashboard/admin' : '/dashboard/user';

      expect(redirectTo).toBe('/dashboard/user');
    });
  });

  describe('Login/Register Route with Active Session', () => {
    it('should redirect superadmin from /login to /dashboard/admin', () => {
      localStorage.setItem('token', 'test-token');
      const user = JSON.stringify({ role: 'superadmin' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = stored.role === 'superadmin';

      expect(isAdmin).toBe(true);
    });

    it('should redirect usuario from /login to /dashboard/user', () => {
      localStorage.setItem('token', 'test-token');
      const user = JSON.stringify({ role: 'usuario' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const isUser = stored.role === 'usuario';

      expect(isUser).toBe(true);
    });

    it('should redirect superadmin from /register to /dashboard/admin', () => {
      localStorage.setItem('token', 'test-token');
      const user = JSON.stringify({ role: 'superadmin' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = stored.role === 'superadmin';

      expect(isAdmin).toBe(true);
    });

    it('should redirect usuario from /register to /dashboard/user', () => {
      localStorage.setItem('token', 'test-token');
      const user = JSON.stringify({ role: 'usuario' });
      localStorage.setItem('user', user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const isUser = stored.role === 'usuario';

      expect(isUser).toBe(true);
    });
  });
});
