import { create } from 'zustand';
import { SolicitudesService } from '../services/solicitudesService';
import type { Solicitud, SolicitudesRequest } from '../types/solicitudes';
import { useAuthStore } from './authStore';
import { AuthService } from '../services/authService';

interface SolicitudesState {
  solicitudes: Solicitud[];
  total: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchSolicitudes: (page?: number, itemsPerPage?: number) => Promise<void>;
  clearError: () => void;
}

export const useSolicitudesStore = create<SolicitudesState>((set, get) => ({
  solicitudes: [],
  total: 0,
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,

  fetchSolicitudes: async (page = 1, itemsPerPage = 10) => {
    set({ loading: true, error: null });
    
    try {
      const authStore = useAuthStore.getState();
      
      if (!authStore.isAuthenticated || !authStore.user || !authStore.token) {
        throw new Error('Usuario no autenticado');
      }

      // Check if token is expired before making API call
      if (AuthService.isTokenExpired(authStore.token)) {
        console.warn('Token expired, clearing session');
        authStore.logout();
        // Redirect to login will be handled by the ProtectedRoute component
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }

      // Create date range (last 6 months by default)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);

      const request: SolicitudesRequest = {
        tk: authStore.token,
        numero_documento: authStore.user.documento || authStore.user.sub,
        fecha_inicial: startDate.toISOString().split('T')[0], // YYYY-MM-DD format
        fecha_final: endDate.toISOString().split('T')[0], // YYYY-MM-DD format
        paginacion: itemsPerPage,
        pagina: page > 1 ? page.toString() : undefined,
      };

      const response = await SolicitudesService.getSolicitudes(request);
      
      set({
        solicitudes: response.solicitudes || [],
        total: response.total || 0,
        currentPage: page,
        totalPages: response.totalPages || 0,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        solicitudes: [],
        total: 0,
        currentPage: 1,
        totalPages: 0,
        loading: false,
        error: error.message || 'Error al obtener solicitudes',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
