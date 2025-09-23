import { jwtDecode } from 'jwt-decode';
import apiClient from './api';
import type { AuthResponse, LoginCredentials, User } from '../types/auth';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Convert credentials to URL-encoded format
      const formData = new URLSearchParams();
      formData.append('usuario', credentials.usuario);
      formData.append('password', credentials.password);

      console.log('Login attempt with:', credentials.usuario);
      console.log('Request URL:', apiClient.defaults.baseURL + '/api/ws_eligetumenu/acceder');

      const response = await apiClient.post('/api/ws_eligetumenu/acceder', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', error);
      console.error('Error response:', error.response);
      
      // Handle API error responses
      const errorMessage = error.response?.data?.mensaje || error.message || 'Error de autenticación';
      throw new Error(errorMessage);
    }
  }

  static decodeToken(token: string): User {
    try {
      return jwtDecode<User>(token);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  static isValidRole(role: string): boolean {
    const validRoles = ['ESTUDIANTE', 'DOCENTE'];
    return validRoles.includes(role.toUpperCase());
  }

  static setSession(token: string): void {
    localStorage.setItem('token', token);
    const user = this.decodeToken(token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  static clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static getStoredToken(): string | null {
    return localStorage.getItem('token');
  }

  static getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  }
}
