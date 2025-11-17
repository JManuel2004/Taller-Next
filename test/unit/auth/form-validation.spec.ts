describe('Form Validation - Login and Register', () => {
  describe('Email Validation', () => {
    it('should validate correct email format', () => {
      const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('admin@mail.com')).toBe(true);
    });

    it('should reject invalid email format', () => {
      const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });

    it('should reject empty email', () => {
      const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('Password Validation', () => {
    it('should accept password with 6+ characters', () => {
      const isValidPassword = (pwd: string) => pwd.length >= 6;
      
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('secret')).toBe(true);
    });

    it('should reject password with less than 6 characters', () => {
      const isValidPassword = (pwd: string) => pwd.length >= 6;
      
      expect(isValidPassword('12345')).toBe(false);
      expect(isValidPassword('abc')).toBe(false);
    });

    it('should reject empty password', () => {
      const isValidPassword = (pwd: string) => pwd.length >= 6;
      
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('Password Confirmation Match', () => {
    it('should accept matching passwords', () => {
      const passwordsMatch = (pwd: string, confirm: string) => pwd === confirm && pwd.length >= 6;
      
      expect(passwordsMatch('password123', 'password123')).toBe(true);
    });

    it('should reject non-matching passwords', () => {
      const passwordsMatch = (pwd: string, confirm: string) => pwd === confirm && pwd.length >= 6;
      
      expect(passwordsMatch('password123', 'password456')).toBe(false);
    });

    it('should reject if one password is too short', () => {
      const passwordsMatch = (pwd: string, confirm: string) => pwd === confirm && pwd.length >= 6;
      
      expect(passwordsMatch('short', 'short')).toBe(false);
    });
  });

  describe('Required Fields Validation', () => {
    it('should validate all required fields present', () => {
      const validateForm = (data: { email?: string; password?: string; fullname?: string }) => {
        return data.email && data.password && data.fullname;
      };

      expect(validateForm({ email: 'test@example.com', password: 'password123', fullname: 'Test User' })).toBeTruthy();
    });

    it('should reject with empty email', () => {
      const validateForm = (data: { email?: string; password?: string; fullname?: string }) => {
        return data.email && data.password && data.fullname;
      };

      expect(validateForm({ email: '', password: 'password123', fullname: 'Test User' })).toBeFalsy();
    });

    it('should reject with empty password', () => {
      const validateForm = (data: { email?: string; password?: string; fullname?: string }) => {
        return data.email && data.password && data.fullname;
      };

      expect(validateForm({ email: 'test@example.com', password: '', fullname: 'Test User' })).toBeFalsy();
    });

    it('should reject with empty fullname', () => {
      const validateForm = (data: { email?: string; password?: string; fullname?: string }) => {
        return data.email && data.password && data.fullname;
      };

      expect(validateForm({ email: 'test@example.com', password: 'password123', fullname: '' })).toBeFalsy();
    });

    it('should reject with missing fields', () => {
      const validateForm = (data: { email?: string; password?: string; fullname?: string }) => {
        return data.email && data.password && data.fullname;
      };

      expect(validateForm({})).toBeFalsy();
    });
  });

  describe('Full Registration Form Validation', () => {
    it('should pass with all valid data', () => {
      const validateRegisterForm = (data: {
        email?: string;
        password?: string;
        confirmPassword?: string;
        fullname?: string;
      }) => {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '');
        const isValidPassword = (data.password || '').length >= 6;
        const passwordsMatch = data.password === data.confirmPassword;
        const hasFullname = !!data.fullname;

        return isValidEmail && isValidPassword && passwordsMatch && hasFullname;
      };

      expect(
        validateRegisterForm({
          email: 'user@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          fullname: 'Test User',
        })
      ).toBe(true);
    });

    it('should fail with invalid email', () => {
      const validateRegisterForm = (data: {
        email?: string;
        password?: string;
        confirmPassword?: string;
        fullname?: string;
      }) => {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '');
        const isValidPassword = (data.password || '').length >= 6;
        const passwordsMatch = data.password === data.confirmPassword;
        const hasFullname = !!data.fullname;

        return isValidEmail && isValidPassword && passwordsMatch && hasFullname;
      };

      expect(
        validateRegisterForm({
          email: 'invalid-email',
          password: 'password123',
          confirmPassword: 'password123',
          fullname: 'Test User',
        })
      ).toBe(false);
    });

    it('should fail with short password', () => {
      const validateRegisterForm = (data: {
        email?: string;
        password?: string;
        confirmPassword?: string;
        fullname?: string;
      }) => {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '');
        const isValidPassword = (data.password || '').length >= 6;
        const passwordsMatch = data.password === data.confirmPassword;
        const hasFullname = !!data.fullname;

        return isValidEmail && isValidPassword && passwordsMatch && hasFullname;
      };

      expect(
        validateRegisterForm({
          email: 'user@example.com',
          password: '123',
          confirmPassword: '123',
          fullname: 'Test User',
        })
      ).toBe(false);
    });

    it('should fail with mismatched passwords', () => {
      const validateRegisterForm = (data: {
        email?: string;
        password?: string;
        confirmPassword?: string;
        fullname?: string;
      }) => {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '');
        const isValidPassword = (data.password || '').length >= 6;
        const passwordsMatch = data.password === data.confirmPassword;
        const hasFullname = !!data.fullname;

        return isValidEmail && isValidPassword && passwordsMatch && hasFullname;
      };

      expect(
        validateRegisterForm({
          email: 'user@example.com',
          password: 'password123',
          confirmPassword: 'password456',
          fullname: 'Test User',
        })
      ).toBe(false);
    });
  });
});
