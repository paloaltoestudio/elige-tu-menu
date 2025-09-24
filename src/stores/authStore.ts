import { create } from 'zustand';
import type { AuthState, User, LoginCredentials } from '../types/auth';
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
  loading: true, // Start with loading true to prevent premature route evaluation
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ loading: true, error: null });
    
    try {
      const response = await AuthService.login(credentials);
      
      // Decode token to get user info
      const user = AuthService.decodeToken(response.token);
      
      // Validate user role
      if (!AuthService.isValidRole(user.rol)) {
        throw new Error('Rol de usuario no autorizado');
      }
      
      // Set session with username and documento
      AuthService.setSession(response.token, credentials.usuario, response.documento);
      
      // Update user object with username and documento
      const userWithData = { 
        ...user, 
        usuario: credentials.usuario,
        documento: response.documento 
      };
      
      set({
        isAuthenticated: true,
        user: userWithData,
        token: response.token,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: error.message || 'Error de autenticación',
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
    set({ loading: true }); // Set loading to true at start
    
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
          loading: false,
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
      loading: false,
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
