import { jwtDecode } from 'jwt-decode';
import apiClient from './api';
import type { AuthResponse, LoginCredentials, User, ChangePasswordRequest, ChangePasswordResponse } from '../types/auth';

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
      
      // Handle API error responses with user-friendly messages
      let errorMessage = error.response?.data?.mensaje || error.message || 'Error de autenticación';
      
      // Map API errors to user-friendly messages
      if (errorMessage.toLowerCase().includes('credenciales') ||
          errorMessage.toLowerCase().includes('usuario') ||
          errorMessage.toLowerCase().includes('contraseña') ||
          errorMessage.toLowerCase().includes('password') ||
          error.response?.status === 401 ||
          error.response?.status === 403) {
        errorMessage = 'Datos incorrectos';
      }
      
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
      const currentTimeMs = Date.now(); // Current time in milliseconds
      
      console.log('Decoded token:', decoded);
      console.log('Current time (ms):', currentTimeMs);
      console.log('Token expiration:', decoded.exp);
      
      
      const isExpired = decoded.exp < currentTimeMs;
      console.log('Token expired:', isExpired);
      console.log('Time difference (ms):', currentTimeMs - decoded.exp);
      
      return isExpired;
    } catch (error) {
      console.error('Error validating token:', error);
      return true;
    }
  }

  static isValidRole(role: string): boolean {
    const validRoles = ['ESTUDIANTE', 'DOCENTE'];
    return validRoles.includes(role.toUpperCase());
  }

  static setSession(token: string, username?: string, documento?: string): void {
    localStorage.setItem('token', token);
    const user = this.decodeToken(token);
    // Add username and documento to user object if provided
    if (username) {
      user.usuario = username;
    }
    if (documento) {
      user.documento = documento;
    }
    localStorage.setItem('user', JSON.stringify(user));
  }

  static clearSession(): void {
    console.log('clearSession called - removing token and user from localStorage');
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

  static async changePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('tk', request.tk);
      formData.append('numero_documento', request.numero_documento);
      formData.append('clave_actual', request.clave_actual);
      formData.append('nueva_clave', request.nueva_clave);
      formData.append('confirmar_clave', request.confirmar_clave);

      console.log('Change password request for:', request.numero_documento);

      const response = await apiClient.post('/api/ws_eligetumenu/actualizar_clave', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Change password response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Change password error:', error);
      const errorMessage = error.response?.data?.mensaje || error.message || 'Error al cambiar la contraseña';
      throw new Error(errorMessage);
    }
  }
}
