import { create } from 'zustand';
import { SolicitarServicioService } from '../services/solicitarServicioService';
import type {
  SolicitarServicioState,
  DiaDisponible,
  TipoServicio,
  Restaurante,
  Menu,
  PedidoCicloActual
} from '../types/solicitarServicio';

interface SolicitarServicioStore extends SolicitarServicioState {
  // Actions
  fetchDiasDisponibles: (tk: string, numeroDocumento: string) => Promise<void>;
  fetchPedidosCicloActual: (tk: string, numeroDocumento: string) => Promise<void>;
  fetchTiposServicio: (tk: string, numeroDocumento: string) => Promise<void>;
  fetchRestaurantes: (tk: string, numeroDocumento: string) => Promise<void>;
  fetchMenus: (tk: string, numeroDocumento: string, restauranteId: number, tipoServicio: number, diaId: number) => Promise<void>;
  realizarPedido: (tk: string, numeroDocumento: string, diaId: number, restauranteId: number, tipoServicio: number, menuId: number, fechaPedido: string) => Promise<void>;
  modificarPedido: (tk: string, numeroDocumento: string, orderId: number, restauranteId: number, tipoServicio: number, menuId: number, fechaPedido: string) => Promise<void>;
  
  // Helper methods
  isEditingDay: (dayId: number) => boolean;
  getExistingOrderForDay: (dayId: number) => PedidoCicloActual | null;
  preloadDataForDay: (day: DiaDisponible) => void;
  
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
  pedidosCicloActual: [],
  existingOrdersMap: {},
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
      // Fetch both available days and current cycle orders in parallel
      const [diasResponse, pedidosResponse] = await Promise.all([
        SolicitarServicioService.getDiasDisponibles({ tk, numero_documento: numeroDocumento }),
        SolicitarServicioService.listarPedidosCicloActual({ tk, numero_documento: numeroDocumento })
      ]);
      
      // Sort days by date to ensure linear order
      const dias = diasResponse.dias_disponibles || [];
      const sortedDays = dias.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      
      const pedidos = pedidosResponse.pedidos || [];
      
      // Create a map of existing orders by day_id
      const existingOrdersMap: Record<number, number> = {};
      pedidos.forEach(pedido => {
        existingOrdersMap[pedido.id_dia] = pedido.id;
      });
      
      // Merge available days with existing orders
      // Days from pedidos that are not in available days should also be included
      const allDayIds = new Set([...sortedDays.map(d => d.id), ...pedidos.map(p => p.id_dia)]);
      const mergedDays: DiaDisponible[] = [];
      
      allDayIds.forEach(dayId => {
        const availableDay = sortedDays.find(d => d.id === dayId);
        const existingOrder = pedidos.find(p => p.id_dia === dayId);
        
        if (availableDay) {
          mergedDays.push(availableDay);
        } else if (existingOrder) {
          // Create a day entry from the existing order
          mergedDays.push({
            id: existingOrder.id_dia,
            nombre: existingOrder.dia,
            fecha: existingOrder.fecha_pedido
          });
        }
      });
      
      // Sort merged days by date
      const sortedMergedDays = mergedDays.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      
      const firstDay = sortedMergedDays.length > 0 ? sortedMergedDays[0] : null;
      
      set({ 
        diasDisponibles: sortedMergedDays,
        pedidosCicloActual: pedidos,
        existingOrdersMap,
        diaSeleccionado: firstDay,
        currentDayIndex: 0,
        loading: false 
      });
      
      // Preload data for the first day if it has an existing order
      if (firstDay) {
        get().preloadDataForDay(firstDay);
      }
    } catch (error: any) {
      set({ 
        error: error.message,
        loading: false 
      });
    }
  },

  fetchPedidosCicloActual: async (tk: string, numeroDocumento: string) => {
    set({ loading: true, error: null });
    try {
      const response = await SolicitarServicioService.listarPedidosCicloActual({ tk, numero_documento: numeroDocumento });
      const pedidos = response.pedidos || [];
      
      // Create a map of existing orders by day_id
      const existingOrdersMap: Record<number, number> = {};
      pedidos.forEach(pedido => {
        existingOrdersMap[pedido.id_dia] = pedido.id;
      });
      
      set({ 
        pedidosCicloActual: pedidos,
        existingOrdersMap,
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
      const state = get();
      const isEditing = state.isEditingDay(diaId);
      
      if (isEditing) {
        // Edit existing order
        const orderId = state.existingOrdersMap[diaId];
        await get().modificarPedido(tk, numeroDocumento, orderId, restauranteId, tipoServicio, menuId, fechaPedido);
      } else {
        // Create new order
        await SolicitarServicioService.realizarPedido({ 
          tk, 
          numero_documento: numeroDocumento,
          dia_id: diaId,
          restaurante_id: restauranteId,
          tipo_servicio: tipoServicio,
          menu_id: menuId,
          fecha_pedido: fechaPedido
        });
      }
      
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

  modificarPedido: async (tk: string, numeroDocumento: string, orderId: number, restauranteId: number, tipoServicio: number, menuId: number, fechaPedido: string) => {
    set({ loading: true, error: null });
    try {
      await SolicitarServicioService.modificarPedido({ 
        tk, 
        numero_documento: numeroDocumento,
        registro: orderId,
        restaurante_id: restauranteId,
        tipo_servicio: tipoServicio,
        menu_id: menuId,
        fecha_pedido: fechaPedido
      });
      
      set({ loading: false });
    } catch (error: any) {
      set({ 
        error: error.message,
        loading: false 
      });
    }
  },

  // Helper methods
  isEditingDay: (dayId: number) => {
    const state = get();
    return dayId in state.existingOrdersMap;
  },

  getExistingOrderForDay: (dayId: number) => {
    const state = get();
    return state.pedidosCicloActual.find(p => p.id_dia === dayId) || null;
  },

  preloadDataForDay: (day: DiaDisponible) => {
    const state = get();
    const existingOrder = state.getExistingOrderForDay(day.id);
    
    if (existingOrder) {
      // Preload the restaurant
      const restaurant = state.restaurantes.find(r => r.id === existingOrder.restaurante_id);
      if (restaurant) {
        set({ restauranteSeleccionado: restaurant });
      }
      
      // Preload the service type
      const serviceType = state.tiposServicio.find(t => t.id === existingOrder.tipo_servicio);
      if (serviceType) {
        set({ tipoServicioSeleccionado: serviceType });
      }
      
      // Note: menu will be preloaded after menus are fetched in the component
      // We'll check if the current day has an existing order and preselect the menu there
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
      const nextDay = state.diasDisponibles[nextIndex];
      set({
        currentDayIndex: nextIndex,
        diaSeleccionado: nextDay,
        currentStep: 0,
        tipoServicioSeleccionado: null,
        restauranteSeleccionado: null,
        menuSeleccionado: null,
        declinarBeneficio: false,
        pedidoRealizado: false,
        menus: []
      });
      
      // Preload data for the next day if it has an existing order
      get().preloadDataForDay(nextDay);
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
