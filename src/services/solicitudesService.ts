import apiClient from './api';
import type { SolicitudesResponse, SolicitudesRequest } from '../types/solicitudes';

export class SolicitudesService {
  static async getSolicitudes(request: SolicitudesRequest): Promise<SolicitudesResponse> {
    try {
      // Convert request to URL-encoded format
      const formData = new URLSearchParams();
      formData.append('tk', request.tk);
      formData.append('numero_documento', request.numero_documento);
      formData.append('fecha_inicial', request.fecha_inicial);
      formData.append('fecha_final', request.fecha_final);
      formData.append('paginacion', request.paginacion.toString());
      formData.append('pagina', request.pagina || '1');
      
      // Add optional filters if provided
      if (request.menu) {
        formData.append('menu', request.menu);
      }
      if (request.estado) {
        formData.append('estado', request.estado);
      }

      console.log('Fetching solicitudes with request:', request);
      console.log('Form data (URLSearchParams):', formData.toString());
      console.log('Request URL:', apiClient.defaults.baseURL + '/api/ws_eligetumenu/listar_pedidos_usuario');

      const response = await apiClient.post('/api/ws_eligetumenu/listar_pedidos_usuario', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transformRequest: [(data) => {
          console.log('Request being sent to API:', data);
          return data;
        }],
      });
      
      console.log('Solicitudes response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching solicitudes:', error);
      console.error('Error response:', error.response);
      
      const errorMessage = error.response?.data?.mensaje || error.message || 'Error al obtener solicitudes';
      throw new Error(errorMessage);
    }
  }
}
