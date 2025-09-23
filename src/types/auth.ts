export interface AuthResponse {
  mensaje: string;
  token: string;
}

export interface User {
  sub: string;
  rol: string;
  iat: number;
  exp: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  usuario: string;
  password: string;
}

export type UserRole = 'ESTUDIANTE' | 'DOCENTE' | 'WEBUSER';
