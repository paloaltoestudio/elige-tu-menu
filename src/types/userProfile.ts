export interface GetUserInfoRequest {
  tk: string;
  numero_documento: string;
}

export interface UserProfile {
  identificacion: number;
  nombreUsuario: string;
  nombreCompleto: string;
  correoElectronico: string;
  telefono: string;
  celular: string;
}

export interface GetUserInfoResponse {
  codigo: number;
  mensaje: string;
  perfil: UserProfile;
}

export interface UpdateUserInfoRequest {
  tk: string;
  numero_documento: string;
  correo?: string;
  telefono?: string;
  celular?: string;
}

export interface UpdateUserInfoResponse {
  success?: boolean;
  message?: string;
  codigo?: string | number;
  mensaje?: string;
}

