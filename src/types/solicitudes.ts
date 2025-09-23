export interface Solicitud {
  id: string;
  menu: string;
  fechaPedido: string;
  estadoPedido: 'SOLICITADO' | 'CONFIRMADO' | 'PREPARANDO' | 'ENTREGADO' | 'CANCELADO';
}

export interface SolicitudesResponse {
  solicitudes: Solicitud[];
  total: number;
  page: number;
  totalPages: number;
  mensaje?: string;
}

export interface SolicitudesRequest {
  tk: string;
  numero_documento: string;
  fecha_inicial: string;
  fecha_final: string;
  paginacion: number;
  pagina?: string;
}
