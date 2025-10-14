import { create } from 'zustand';
import { CancelOrdersService } from '../services/cancelOrdersService';

export interface OrderToCancel {
  registro: number;
  fecha_pedido: string;
  nombre_menu: string;
}

export interface CancelOrdersState {
  ordersToCancel: OrderToCancel[];
  loading: boolean;
  error: string | null;
  cancelingOrderId: number | null;
}

interface CancelOrdersStore extends CancelOrdersState {
  fetchOrdersToCancel: (token: string, documentNumber: string) => Promise<void>;
  cancelOrder: (token: string, documentNumber: string, order: OrderToCancel) => Promise<void>;
  clearError: () => void;
}

export const useCancelOrdersStore = create<CancelOrdersStore>((set, get) => ({
  ordersToCancel: [],
  loading: false,
  error: null,
  cancelingOrderId: null,

  fetchOrdersToCancel: async (token: string, documentNumber: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await CancelOrdersService.getOrdersToCancel(token, documentNumber);
      
      // Convert the response object to an array
      const ordersArray = Object.values(response);
      
      set({ 
        ordersToCancel: ordersArray,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Error al obtener los pedidos para cancelar',
        loading: false 
      });
    }
  },

  cancelOrder: async (token: string, documentNumber: string, order: OrderToCancel) => {
    set({ cancelingOrderId: order.registro, error: null });
    
    try {
      await CancelOrdersService.cancelOrder({
        tk: token,
        numero_documento: documentNumber,
        registro: order.registro,
        fecha_pedido: order.fecha_pedido
      });
      
      // Remove the canceled order from the list
      const currentOrders = get().ordersToCancel;
      const updatedOrders = currentOrders.filter(o => o.registro !== order.registro);
      
      set({ 
        ordersToCancel: updatedOrders,
        cancelingOrderId: null 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Error al cancelar el pedido',
        cancelingOrderId: null 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
