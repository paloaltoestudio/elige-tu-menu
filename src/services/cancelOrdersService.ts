import api from './api';

export interface CancelOrderRequest {
  tk: string;
  numero_documento: string;
  registro: number;
  fecha_pedido: string;
}

export interface CancelOrderResponse {
  success: boolean;
  message: string;
}

export interface OrdersToCancelResponse {
  [key: string]: {
    registro: number;
    fecha_pedido: string;
    nombre_menu: string;
  };
}

export class CancelOrdersService {
  static async getOrdersToCancel(token: string, documentNumber: string): Promise<OrdersToCancelResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('tk', token);
      formData.append('numero_documento', documentNumber);

      const response = await api.post('/api/ws_eligetumenu/listar_pedidos_cancelar', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error fetching orders to cancel:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los pedidos para cancelar');
    }
  }

  static async cancelOrder(request: CancelOrderRequest): Promise<CancelOrderResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('tk', request.tk);
      formData.append('numero_documento', request.numero_documento);
      formData.append('registro', request.registro.toString());
      formData.append('fecha_pedido', request.fecha_pedido);

      const response = await api.post('/api/ws_eligetumenu/cancelar_pedido', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error canceling order:', error);
      throw new Error(error.response?.data?.message || 'Error al cancelar el pedido');
    }
  }
}