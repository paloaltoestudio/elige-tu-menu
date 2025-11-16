// Types for the "Solicitar Servicio" functionality

export interface DiaDisponible {
  id: number;
  nombre: string;
  fecha: string;
}

export interface DiasDisponiblesResponse {
  codigo: string;
  mensaje: string;
  dias_disponibles: DiaDisponible[];
}

export interface TipoServicio {
  id: number;
  nombre: string;
}

export interface TiposServicioResponse {
  codigo: string;
  mensaje: string;
  tipos_servicio: Record<string, TipoServicio>;
}

export interface Restaurante {
  id: number;
  nombre: string;
}

export interface RestaurantesResponse {
  codigo: string;
  mensaje: string;
  restaurantes: Restaurante[];
}

export interface Menu {
  id: number;
  nombre: string;
  foto?: string;
  descripcion?: string;
}

export interface MenusResponse {
  codigo: string;
  mensaje: string;
  menus: Menu[];
}

export interface Pedido {
  id: number;
  menu_id: number;
  menu_nombre: string;
  foto?: string;
}

export interface RealizarPedidoResponse {
  success: boolean;
  pedido: Pedido;
}

// Request types
export interface DiasDisponiblesRequest {
  tk: string;
  numero_documento: string;
}

export interface TiposServicioRequest {
  tk: string;
  numero_documento: string;
}

export interface RestaurantesRequest {
  tk: string;
  numero_documento: string;
}

export interface MenusRequest {
  tk: string;
  numero_documento: string;
  restaurante_id: number;
  tipo_servicio: number;
  dia_id: number;
  fecha_pedido: string;
}

export interface RealizarPedidoRequest {
  tk: string;
  numero_documento: string;
  dia_id: number;
  restaurante_id: number;
  tipo_servicio: number;
  menu_id: number;
  fecha_pedido: string; // format: 2025-10-13
}

// Types for current cycle orders
export interface PedidoCicloActual {
  id: number; // order id for editing
  id_menu: string;
  nombre_menu: string;
  restaurante_id: number;
  tipo_servicio: number;
  fecha_pedido: string;
  dia: string;
  id_dia: number;
}

export interface ListarPedidosCicloActualRequest {
  tk: string;
  numero_documento: string;
}

export interface ListarPedidosCicloActualResponse {
  codigo: string;
  mensaje: string;
  pedidos: PedidoCicloActual[];
}

// Types for editing orders
export interface ModificarPedidoRequest {
  tk: string;
  numero_documento: string;
  registro: number; // order id
  restaurante_id: number;
  tipo_servicio: number;
  menu_id: number;
  fecha_pedido: string;
}

export interface ModificarPedidoResponse {
  success: boolean;
}

// Types for ticket availability
export interface TicketDisponible {
  nombre: string;
  fecha_ffin: string;
}

export type DisponibilidadTicketsSuccess = Record<string, TicketDisponible>;

export interface DisponibilidadTicketsError {
  success: false;
  message: string;
}

export interface DisponibilidadTicketsRequest {
  tk: string;
  numero_documento: string;
}

export interface DisponibilidadTicketsResponse {
  codigo: string;
  mensaje: string;
  disponibilidad_servicio_tickets: DisponibilidadTicketsSuccess | DisponibilidadTicketsError;
}

// State types for the component
export interface SolicitarServicioState {
  // Available data
  diasDisponibles: DiaDisponible[];
  tiposServicio: TipoServicio[];
  restaurantes: Restaurante[];
  menus: Menu[];
  hasAvailableDays: boolean;
  
  // Current cycle orders (existing orders)
  pedidosCicloActual: PedidoCicloActual[];
  
  // Map to track which days have existing orders (day_id -> order_id)
  existingOrdersMap: Record<number, number>;
  
  // Ticket availability
  hasActiveTickets: boolean;
  ticketsErrorMessage: string | null;
  serviceAvailabilityDate: string | null; // Store the service end date
  
  // Current selections
  diaSeleccionado: DiaDisponible | null;
  tipoServicioSeleccionado: TipoServicio | null;
  restauranteSeleccionado: Restaurante | null;
  menuSeleccionado: Menu | null;
  declinarBeneficio: boolean;
  
  // Linear day tracking
  currentDayIndex: number;
  completedDays: string[]; // track by fecha to handle repeated day ids across weeks
  
  // UI state
  loading: boolean;
  error: string | null;
  currentStep: number; // 0: select restaurant/service and menu, 1: confirm
  pedidoRealizado: boolean;
}
