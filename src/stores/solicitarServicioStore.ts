import { create } from 'zustand';
import { SolicitarServicioService } from '../services/solicitarServicioService';
import type {
  SolicitarServicioState,
  // DiaDisponible,
  TipoServicio,
  Restaurante,
  Menu
} from '../types/solicitarServicio';

interface SolicitarServicioStore extends SolicitarServicioState {
  // Actions
  fetchDiasDisponibles: (tk: string, numeroDocumento: string) => Promise<void>;
  fetchTiposServicio: (tk: string, numeroDocumento: string) => Promise<void>;
  fetchRestaurantes: (tk: string, numeroDocumento: string) => Promise<void>;
  fetchMenus: (tk: string, numeroDocumento: string, restauranteId: number, tipoServicio: number, diaId: number) => Promise<void>;
  realizarPedido: (tk: string, numeroDocumento: string, diaId: number, restauranteId: number, tipoServicio: number, menuId: number, fechaPedido: string) => Promise<void>;
  
  // Selection actions
  selectTipoServicio: (tipoServicio: TipoServicio) => void;
  selectRestaurante: (restaurante: Restaurante) => void;
  selectMenu: (menu: Menu) => void;
  toggleDeclinarBeneficio: () => void;
  
  // Linear day navigation
  nextDay: () => void;
  previousDay: () => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
  
  // Error handling
  clearError: () => void;
}

const initialState: SolicitarServicioState = {
  diasDisponibles: [],
  tiposServicio: [],
  restaurantes: [],
  menus: [],
  diaSeleccionado: null,
  tipoServicioSeleccionado: null,
  restauranteSeleccionado: null,
  menuSeleccionado: null,
  declinarBeneficio: false,
  currentDayIndex: 0,
  completedDays: [],
  loading: false,
  error: null,
  currentStep: 0,
  pedidoRealizado: false,
};

export const useSolicitarServicioStore = create<SolicitarServicioStore>((set, get) => ({
  ...initialState,

  fetchDiasDisponibles: async (tk: string, numeroDocumento: string) => {
    set({ loading: true, error: null });
    try {
      const response = await SolicitarServicioService.getDiasDisponibles({ tk, numero_documento: numeroDocumento });
      // Sort days by date to ensure linear order
      const dias = response.dias_disponibles || [];
      const sortedDays = dias.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      set({ 
        diasDisponibles: sortedDays,
        diaSeleccionado: sortedDays.length > 0 ? sortedDays[0] : null,
        currentDayIndex: 0,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message,
        loading: false 
      });
    }
  },

  fetchTiposServicio: async (tk: string, numeroDocumento: string) => {
    set({ loading: true, error: null });
    try {
      const response = await SolicitarServicioService.getTiposServicio({ tk, numero_documento: numeroDocumento });
      // Convert object to array
      const tiposArray = Object.values(response.tipos_servicio);
      set({ 
        tiposServicio: tiposArray,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message,
        loading: false 
      });
    }
  },

  fetchRestaurantes: async (tk: string, numeroDocumento: string) => {
    set({ loading: true, error: null });
    try {
      const response = await SolicitarServicioService.getRestaurantes({ tk, numero_documento: numeroDocumento });
      set({ 
        restaurantes: response.restaurantes,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message,
        loading: false 
      });
    }
  },

  fetchMenus: async (tk: string, numeroDocumento: string, restauranteId: number, tipoServicio: number, diaId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await SolicitarServicioService.getMenus({ 
        tk, 
        numero_documento: numeroDocumento,
        restaurante_id: restauranteId,
        tipo_servicio: tipoServicio,
        dia_id: diaId
      });
      set({ 
        menus: response.menus || [],
        loading: false 
      });
    } catch (error: any) {
      set({ 
        menus: [],
        error: error.message,
        loading: false 
      });
    }
  },

  realizarPedido: async (tk: string, numeroDocumento: string, diaId: number, restauranteId: number, tipoServicio: number, menuId: number, fechaPedido: string) => {
    set({ loading: true, error: null });
    try {
      await SolicitarServicioService.realizarPedido({ 
        tk, 
        numero_documento: numeroDocumento,
        dia_id: diaId,
        restaurante_id: restauranteId,
        tipo_servicio: tipoServicio,
        menu_id: menuId,
        fecha_pedido: fechaPedido
      });
      
      const state = get();
      const completedDays = [...state.completedDays, diaId];
      
      set({ 
        pedidoRealizado: true,
        completedDays,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message,
        loading: false 
      });
    }
  },

  selectTipoServicio: (tipoServicio: TipoServicio) => {
    set({ tipoServicioSeleccionado: tipoServicio });
  },

  selectRestaurante: (restaurante: Restaurante) => {
    set({ restauranteSeleccionado: restaurante });
  },

  selectMenu: (menu: Menu) => {
    set({ menuSeleccionado: menu });
  },

  toggleDeclinarBeneficio: () => {
    set((state) => ({ declinarBeneficio: !state.declinarBeneficio }));
  },

  nextDay: () => {
    const state = get();
    const nextIndex = state.currentDayIndex + 1;
    if (nextIndex < state.diasDisponibles.length) {
      set({
        currentDayIndex: nextIndex,
        diaSeleccionado: state.diasDisponibles[nextIndex],
        currentStep: 0,
        tipoServicioSeleccionado: null,
        restauranteSeleccionado: null,
        menuSeleccionado: null,
        declinarBeneficio: false,
        pedidoRealizado: false,
        menus: []
      });
    }
  },

  previousDay: () => {
    const state = get();
    const prevIndex = state.currentDayIndex - 1;
    if (prevIndex >= 0) {
      set({
        currentDayIndex: prevIndex,
        diaSeleccionado: state.diasDisponibles[prevIndex],
        currentStep: 0,
        tipoServicioSeleccionado: null,
        restauranteSeleccionado: null,
        menuSeleccionado: null,
        declinarBeneficio: false,
        pedidoRealizado: false,
        menus: []
      });
    }
  },

  nextStep: () => {
    set((state) => ({ currentStep: Math.min(state.currentStep + 1, 1) }));
  },

  previousStep: () => {
    set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) }));
  },

  reset: () => {
    set(initialState);
  },

  clearError: () => {
    set({ error: null });
  },
}));
