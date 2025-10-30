export interface AuthResponse {
  mensaje: string;
  token: string;
  documento?: string;
  nombres?: string;
}

export interface User {
  sub: string;
  rol: string;
  usuario?: string; // Add username field
  documento?: string; // Add document field
  nombres?: string; // Add full name field
  iat: number;
  exp: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  initializing: boolean;
  error: string | null;
}

export interface LoginCredentials {
  usuario: string;
  password: string;
}

export interface ChangePasswordRequest {
  tk: string;
  numero_documento: string;
  clave_actual: string;
  nueva_clave: string;
  confirmar_clave: string;
}

export interface ChangePasswordResponse {
  codigo: string;
  mensaje: string;
}

export interface ForgotPasswordRequest {
  correo: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    correo: string;
    token: string;
  };
}

export interface ResetPasswordRequest {
  tk: string;
  nuevo_password: string;
  confirmar_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export type UserRole = 'ESTUDIANTE' | 'DOCENTE' | 'WEBUSER';
