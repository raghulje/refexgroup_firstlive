import api from '../../../services/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: number | string;
    username: string;
    email?: string;
    role?: string;
    isActive?: boolean;
    lastLogin?: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Production-ready authentication service using backend API
export const authService = {
  /**
   * Login user with username and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data && response.data.data) {
        const { token, refreshToken, user } = response.data.data;
        
        // Store tokens and user info
        localStorage.setItem('admin_token', token);
        if (refreshToken) {
          localStorage.setItem('admin_refresh_token', refreshToken);
        }
        localStorage.setItem('admin_user', JSON.stringify(user));
        
        return { token, refreshToken, user };
      }
      
      throw new Error('Invalid response from server');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Login failed';
      throw new Error(errorMessage);
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint (optional, mainly for server-side tracking)
      await api.post('/auth/logout').catch(() => {
        // Ignore errors on logout
      });
    } finally {
      // Always clear local storage
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_refresh_token');
    }
  },

  /**
   * Get current user info from server
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get('/auth/me');
      if (response.data && response.data.data) {
        const user = response.data.data;
        localStorage.setItem('admin_user', JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<string | null> => {
    try {
      const refreshToken = localStorage.getItem('admin_refresh_token');
      if (!refreshToken) {
        return null;
      }

      const response = await api.post('/auth/refresh', { refreshToken });
      
      if (response.data && response.data.data && response.data.data.token) {
        const newToken = response.data.data.token;
        localStorage.setItem('admin_token', newToken);
        return newToken;
      }
      
      return null;
    } catch (error) {
      // Refresh failed, clear tokens
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      return null;
    }
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to change password';
      throw new Error(errorMessage);
    }
  },

  /**
   * Get stored token
   */
  getToken: (): string | null => {
    return localStorage.getItem('admin_token');
  },

  /**
   * Get stored user info
   */
  getUser: (): User | null => {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('admin_token');
  },

  /**
   * Check if user has specific role
   */
  hasRole: (role: string): boolean => {
    const user = authService.getUser();
    return user?.role === role;
  },

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole: (...roles: string[]): boolean => {
    const user = authService.getUser();
    return user ? roles.includes(user.role) : false;
  },

  /**
   * Check if user is Super Admin
   */
  isSuperAdmin: (): boolean => {
    return authService.hasRole('Super Admin');
  },

  /**
   * Check if user is Admin or Super Admin
   */
  isAdmin: (): boolean => {
    return authService.hasAnyRole('Super Admin', 'Admin');
  },
};

