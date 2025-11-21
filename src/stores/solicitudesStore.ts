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
  filters: {
    menu: string;
    fechaDesde: string;
    fechaHasta: string;
    estado: string;
  };
  availableMenus: string[];
  fetchSolicitudes: (page?: number, itemsPerPage?: number, filters?: SolicitudesState['filters']) => Promise<void>;
  updateFilters: (filters: Partial<SolicitudesState['filters']>) => void;
  clearError: () => void;
  resetFilterOptions: () => void;
}

export const useSolicitudesStore = create<SolicitudesState>((set, get) => ({
  solicitudes: [],
  total: 0,
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
  filters: {
    menu: '',
    fechaDesde: '',
    fechaHasta: '',
    estado: '',
  },
  availableMenus: [],

  fetchSolicitudes: async (page = 1, itemsPerPage = 10, filters = get().filters) => {
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

      // Use filters for date range or default to last 6 months
      let fechaInicial, fechaFinal;
      
      // Handle fechaDesde (from date)
      if (filters.fechaDesde) {
        fechaInicial = filters.fechaDesde;
      } else {
        // Default to 6 months ago if no from date
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);
        fechaInicial = startDate.toISOString().split('T')[0];
      }
      
      // Handle fechaHasta (to date)
      if (filters.fechaHasta) {
        fechaFinal = filters.fechaHasta;
      } else {
        // Default to 6 months ahead if no to date
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 6);
        fechaFinal = endDate.toISOString().split('T')[0];
      }

      const request: SolicitudesRequest = {
        tk: authStore.token,
        numero_documento: authStore.user.documento || authStore.user.sub,
        fecha_inicial: fechaInicial,
        fecha_final: fechaFinal,
        paginacion: itemsPerPage,
        pagina: page > 1 ? page.toString() : '1',
        ...(filters.menu && { menu: filters.menu }),
        ...(filters.estado && { estado: filters.estado }),
      };

      const response = await SolicitudesService.getSolicitudes(request);
      
      // Convert object to array if needed
      let pedidosArray: Solicitud[] = [];
      if (response.pedidos) {
        if (Array.isArray(response.pedidos)) {
          pedidosArray = response.pedidos;
        } else {
          // If it's an object, convert to array
          pedidosArray = Object.values(response.pedidos);
        }
      }
      
      // Extract menus from menus_filtro if available (contains all unique menus from all pages)
      // Otherwise fall back to extracting from current page results
      let uniqueMenus: string[] = [];
      
      if (response.menus_filtro?.menus) {
        // Parse comma-separated string from API and convert to sorted array
        uniqueMenus = response.menus_filtro.menus
          .split(',')
          .map(menu => menu.trim())
          .filter(Boolean)
          .sort();
      } else {
        // Fallback: extract from current page results if menus_filtro is not available
        const currentState = get();
        const menusFromCurrentResults = [...new Set(pedidosArray.map(p => p.menu))].filter(Boolean);
        uniqueMenus = [...new Set([...currentState.availableMenus, ...menusFromCurrentResults])].sort();
      }
      
      set({
        solicitudes: pedidosArray,
        total: response.paginacion?.total_registros || 0,
        currentPage: response.paginacion?.pagina_actual || page,
        totalPages: response.paginacion?.total_paginas || 0,
        availableMenus: uniqueMenus,
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

  updateFilters: (newFilters) => {
    const currentFilters = get().filters;
    const updatedFilters = { ...currentFilters, ...newFilters };
    set({ filters: updatedFilters });
  },

  clearError: () => {
    set({ error: null });
  },

  resetFilterOptions: () => {
    set({ availableMenus: [] });
  },
}));
