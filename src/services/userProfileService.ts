import apiClient from './api';
import type {
  GetUserInfoRequest,
  GetUserInfoResponse,
  UpdateUserInfoRequest,
  UpdateUserInfoResponse,
} from '../types/userProfile';

export class UserProfileService {
  static async getUserInfo(request: GetUserInfoRequest): Promise<GetUserInfoResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('tk', request.tk);
      formData.append('numero_documento', request.numero_documento);

      console.log('Fetching user info for:', request.numero_documento);
      console.log('Request URL:', apiClient.defaults.baseURL + '/api/ws_eligetumenu/informacion_usuario');

      const response = await apiClient.post('/api/ws_eligetumenu/informacion_usuario', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('User info response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user info:', error);
      console.error('Error response:', error.response);

      const errorMessage = error.response?.data?.mensaje || error.message || 'Error al obtener información del usuario';
      throw new Error(errorMessage);
    }
  }

  static async updateUserInfo(request: UpdateUserInfoRequest): Promise<UpdateUserInfoResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('tk', request.tk);
      formData.append('numero_documento', request.numero_documento);

      // Only append fields that are provided and not empty
      if (request.correo !== undefined && request.correo.trim() !== '') {
        formData.append('correo', request.correo.trim());
      }
      if (request.telefono !== undefined && request.telefono.trim() !== '') {
        formData.append('telefono', request.telefono.trim());
      }
      if (request.celular !== undefined && request.celular.trim() !== '') {
        formData.append('celular', request.celular.trim());
      }

      // Validate that at least one optional field is provided
      const hasAtLeastOneField = 
        (request.correo !== undefined && request.correo.trim() !== '') ||
        (request.telefono !== undefined && request.telefono.trim() !== '') ||
        (request.celular !== undefined && request.celular.trim() !== '');

      if (!hasAtLeastOneField) {
        throw new Error('Debe proporcionar al menos un campo para actualizar');
      }

      console.log('Updating user info for:', request.numero_documento);
      console.log('Request URL:', apiClient.defaults.baseURL + '/api/ws_eligetumenu/actualizar_informacion_usuario');

      const response = await apiClient.post('/api/ws_eligetumenu/actualizar_informacion_usuario', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('Update user info response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating user info:', error);
      console.error('Error response:', error.response);

      // Handle API error responses
      if (error.response?.data?.mensaje) {
        throw new Error(error.response.data.mensaje);
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      const errorMessage = error.message || 'Error al actualizar información del usuario';
      throw new Error(errorMessage);
    }
  }
}

