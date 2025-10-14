export interface OrderToCancel {
  registro: number;
  fecha_pedido: string;
  nombre_menu: string;
}

export interface OrdersToCancelResponse {
  [key: string]: OrderToCancel;
}

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

export interface CancelOrdersState {
  ordersToCancel: OrderToCancel[];
  loading: boolean;
  error: string | null;
  cancelingOrderId: number | null;
}
