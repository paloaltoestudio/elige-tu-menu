import { create } from 'zustand';
import type { AuthState, LoginCredentials } from '../types/auth';
import { AuthService } from '../services/authService';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
  clearError: () => void;
  checkTokenExpiration: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  initializing: true, // Start with initializing true to prevent premature route evaluation
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ loading: true, error: null });
    
    try {
      const response = await AuthService.login(credentials);
      
      // Decode token to get user info
      let user;
      try {
        user = AuthService.decodeToken(response.token);
      } catch (tokenError) {
        // If token is invalid, treat it as incorrect credentials
        throw new Error('Datos incorrectos');
      }
      
      // Validate user role
      if (!AuthService.isValidRole(user.rol)) {
        throw new Error('Rol de usuario no autorizado');
      }
      
      // Set session with username, documento, and nombres
      AuthService.setSession(response.token, credentials.usuario, response.documento, response.nombres);
      
      // Update user object with username, documento, and nombres
      const userWithData = { 
        ...user, 
        usuario: credentials.usuario,
        documento: response.documento,
        nombres: response.nombres
      };
      
      set({
        isAuthenticated: true,
        user: userWithData,
        token: response.token,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      // Normalize error messages for better UX
      let errorMessage = error.message || 'Error de autenticación';
      
      // Map common errors to user-friendly messages
      if (errorMessage.toLowerCase().includes('token inválido') || 
          errorMessage.toLowerCase().includes('invalid token') ||
          errorMessage.toLowerCase().includes('credenciales')) {
        errorMessage = 'Datos incorrectos';
      }
      
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  logout: () => {
    AuthService.clearSession();
    set({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    });
  },

  initializeAuth: () => {
    set({ initializing: true }); // Set initializing to true at start
    
    const token = AuthService.getStoredToken();
    const user = AuthService.getStoredUser();
    
    console.log('initializeAuth - token:', token);
    console.log('initializeAuth - user:', user);
    console.log('localStorage token:', localStorage.getItem('token'));
    console.log('localStorage user:', localStorage.getItem('user'));
    
    if (token && user) {
      const isExpired = AuthService.isTokenExpired(token);
      console.log('initializeAuth - token expired:', isExpired);
      
      if (!isExpired) {
        console.log('initializeAuth - setting authenticated');
        set({
          isAuthenticated: true,
          user,
          token,
          initializing: false,
          error: null,
        });
        return;
      }
    }
    
    console.log('initializeAuth - clearing session');
    // Clear invalid session
    AuthService.clearSession();
    set({
      isAuthenticated: false,
      user: null,
      token: null,
      initializing: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  checkTokenExpiration: () => {
    const { token, isAuthenticated } = get();
    
    if (isAuthenticated && token && AuthService.isTokenExpired(token)) {
      console.warn('Token expired during app usage, logging out');
      get().logout();
    }
  },
}));
