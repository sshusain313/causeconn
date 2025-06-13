import api from './apiClient';
import { isProduction } from './apiConfig';
import { AxiosResponse } from 'axios';

interface LoginResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    name: string;
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    const { token, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('token', token);
    
    return { token, user };
  } catch (error) {
    console.error('Login failed:', error);
    if (isProduction) {
      throw new Error('Login failed: API error and mock login not allowed in production');
    }
    // Mock login for development
    console.warn('API login failed, using mock login');
    const mockResponse: LoginResponse = {
      token: 'mock-token',
      user: {
        _id: 'mock-id',
        email,
        name: 'Mock User'
      }
    };
    localStorage.setItem('token', mockResponse.token);
    return mockResponse;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
  login,
  logout,
  getToken,
  isAuthenticated,
  getAuthHeaders
}; 