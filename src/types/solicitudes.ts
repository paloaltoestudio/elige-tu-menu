export interface Solicitud {
  menu: string;
  restaurante: string;
  tipo_servicio: string;
  fecha_pedido: string;
  estado: 'SOLICITADO' | 'DESPACHADO' | 'CANCELADO' | 'EN NOVEDAD';
}

export interface SolicitudesResponse {
  codigo: string;
  mensaje: string;
  pedidos: Solicitud[];
  paginacion: {
    pagina_actual: number;
    registros_por_pagina: number;
    tiene_anterior: boolean;
    tiene_siguiente: boolean;
    total_paginas: number;
    total_registros: number;
  };
  menus_filtro?: {
    menus: string;
  };
}

export interface SolicitudesRequest {
  tk: string;
  numero_documento: string;
  fecha_inicial: string;
  fecha_final: string;
  paginacion: number;
  pagina?: string;
  menu?: string;
  estado?: string;
}
