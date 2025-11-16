import apiClient from './api';
import type {
  DiasDisponiblesRequest,
  DiasDisponiblesResponse,
  TiposServicioRequest,
  TiposServicioResponse,
  RestaurantesRequest,
  RestaurantesResponse,
  MenusRequest,
  MenusResponse,
  RealizarPedidoRequest,
  RealizarPedidoResponse,
  ListarPedidosCicloActualRequest,
  ListarPedidosCicloActualResponse,
  ModificarPedidoRequest,
  ModificarPedidoResponse,
  DisponibilidadTicketsRequest,
  DisponibilidadTicketsResponse
} from '../types/solicitarServicio';

export class SolicitarServicioService {
  static async getDiasDisponibles(request: DiasDisponiblesRequest): Promise<DiasDisponiblesResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('tk', request.tk);
      formData.append('numero_documento', request.numero_documento);

      console.log('Fetching dias disponibles with request:', request);

      const response = await apiClient.post('/api/ws_eligetumenu/dias_disponibles_usuario', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Dias disponibles response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching dias disponibles:', error);
      const errorMessage = error.response?.data?.mensaje || error.message || 'Error al obtener días disponibles';
      throw new Error(errorMessage);
    }
  }

  static async getTiposServicio(request: TiposServicioRequest): Promise<TiposServicioResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('tk', request.tk);
      formData.append('numero_documento', request.numero_documento);

      console.log('Fetching tipos servicio with request:', request);

      const response = await apiClient.post('/api/ws_eligetumenu/tipos_servicio_x_usuario', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Tipos servicio response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tipos servicio:', error);
      const errorMessage = error.response?.data?.mensaje || error.message || 'Error al obtener tipos de servicio';
      throw new Error(errorMessage);
    }
  }

  static async getRestaurantes(request: RestaurantesRequest): Promise<RestaurantesResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('tk', request.tk);
      formData.append('numero_documento', request.numero_documento);

      console.log('Fetching restaurantes with request:', request);

      const response = await apiClient.post('/api/ws_eligetumenu/listar_restaurantes_usuario', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Restaurantes response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching restaurantes:', error);
      const errorMessage = error.response?.data?.mensaje || error.message || 'Error al obtener restaurantes';
      throw new Error(errorMessage);
    }
  }

  static async getMenus(request: MenusRequest): Promise<MenusResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('tk', request.tk);
      formData.append('numero_documento', request.numero_documento);
      formData.append('restaurante_id', request.restaurante_id.toString());
      formData.append('tipo_servicio', request.tipo_servicio.toString());
      formData.append('dia_id', request.dia_id.toString());
      formData.append('fecha_pedido', request.fecha_pedido);

      console.log('Fetching menus with request:', request);

      const response = await apiClient.post('/api/ws_eligetumenu/listar_menus_usuario', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Menus response:', response.data);
      console.log('Menus response status:', response.status);
      
      // Handle 204 No Content - means no menus available
      if (response.status === 204 || !response.data) {
        return {
          codigo: '200',
          mensaje: 'No hay menús disponibles',
          menus: []
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching menus:', error);
      const errorMessage = error.response?.data?.mensaje || error.message || 'Error al obtener menús';
      throw new Error(errorMessage);
    }
  }

  static async realizarPedido(request: RealizarPedidoRequest): Promise<RealizarPedidoResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('tk', request.tk);
      formData.append('numero_documento', request.numero_documento);
      formData.append('dia_id', request.dia_id.toString());
      formData.append('restaurante_id', request.restaurante_id.toString());
      formData.append('tipo_servicio', request.tipo_servicio.toString());
      formData.append('menu_id', request.menu_id.toString());
      formData.append('fecha_pedido', request.fecha_pedido);

      console.log('Creating pedido with request:', request);

      const response = await apiClient.post('/api/ws_eligetumenu/realizar_pedido', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Realizar pedido response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating pedido:', error);
      const errorMessage = error.response?.data?.mensaje || error.message || 'Error al realizar el pedido';
      throw new Error(errorMessage);
    }
  }

  static async listarPedidosCicloActual(request: ListarPedidosCicloActualRequest): Promise<ListarPedidosCicloActualResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('tk', request.tk);
      formData.append('numero_documento', request.numero_documento);

      console.log('Fetching current cycle orders with request:', request);

      const response = await apiClient.post('/api/ws_eligetumenu/listar_pedidos_ciclo_actual', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Current cycle orders response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching current cycle orders:', error);
      const errorMessage = error.response?.data?.mensaje || error.message || 'Error al obtener pedidos del ciclo actual';
      throw new Error(errorMessage);
    }
  }

  static async modificarPedido(request: ModificarPedidoRequest): Promise<ModificarPedidoResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('tk', request.tk);
      formData.append('numero_documento', request.numero_documento);
      formData.append('registro', request.registro.toString());
      formData.append('restaurante_id', request.restaurante_id.toString());
      formData.append('tipo_servicio', request.tipo_servicio.toString());
      formData.append('menu_id', request.menu_id.toString());
      formData.append('fecha_pedido', request.fecha_pedido);

      console.log('Modifying pedido with request:', request);

      const response = await apiClient.post('/api/ws_eligetumenu/modificar_pedido', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Modificar pedido response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error modifying pedido:', error);
      const errorMessage = error.response?.data?.mensaje || error.message || 'Error al modificar el pedido';
      throw new Error(errorMessage);
    }
  }

  static async checkDisponibilidadTickets(request: DisponibilidadTicketsRequest): Promise<DisponibilidadTicketsResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('tk', request.tk);
      formData.append('numero_documento', request.numero_documento);

      console.log('Checking ticket availability with request:', request);

      const response = await apiClient.post('/api/ws_eligetumenu/disponibilidad_servicio_tickets', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Ticket availability response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error checking ticket availability:', error);
      const errorMessage = error.response?.data?.mensaje || error.message || 'Error al verificar disponibilidad de tickets';
      throw new Error(errorMessage);
    }
  }
}
