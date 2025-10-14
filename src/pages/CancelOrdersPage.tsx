import { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { useCancelOrdersStore } from '../stores/cancelOrdersStore';

export const CancelOrdersPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, token } = useAuthStore();
  
  const {
    ordersToCancel,
    loading,
    error,
    cancelingOrderId,
    fetchOrdersToCancel,
    cancelOrder,
    clearError,
  } = useCancelOrdersStore();

  useEffect(() => {
    if (user && token && user.documento) {
      fetchOrdersToCancel(token, user.documento);
    }
  }, [user, token, fetchOrdersToCancel]);

  const handleCancelOrder = async (order: any) => {
    if (user && token && user.documento) {
      const confirmed = window.confirm(
        `¿Estás seguro de que deseas cancelar el pedido del ${order.fecha_pedido}?\n\nMenú: ${order.nombre_menu}`
      );
      
      if (confirmed) {
        await cancelOrder(token, user.documento, order);
      }
    }
  };

  const formatDate = (dateString: string) => {
    // Convert from YYYY-MM-DD to DD-MM-YYYY format
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  if (loading && ordersToCancel.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        
        <div className="flex">
          <Sidebar 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          
          <main className="flex-1 p-3 sm:p-4 lg:p-8">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-3 sm:px-4 lg:px-6 py-6">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Cargando pedidos...</span>
                </div>
              </div>
            </div>
          </main>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      <div className="flex">
        <Sidebar 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Page Title */}
            <div className="border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                Cancelar Pedidos
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Selecciona los pedidos que deseas cancelar dentro de las horas habilitadas
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-3 sm:mx-4 lg:mx-6 mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fa-solid fa-exclamation-triangle text-red-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                    <button
                      onClick={clearError}
                      className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Search Button */}
            <div className="px-3 sm:px-4 lg:px-6 py-4 border-b border-gray-200">
              <Button
                onClick={() => {
                  if (user && token && user.documento) {
                    fetchOrdersToCancel(token, user.documento);
                  }
                }}
                variant="outline"
                size="sm"
                disabled={loading}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <i className="fa-solid fa-chevron-down mr-2"></i>
                Realizar búsqueda
              </Button>
            </div>

            {/* Orders Table */}
            <div className="px-3 sm:px-4 lg:px-6 py-4">
              {loading && ordersToCancel.length === 0 ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando pedidos...</p>
                </div>
              ) : ordersToCancel.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fa-solid fa-check-circle text-4xl text-green-500 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay pedidos para cancelar
                  </h3>
                  <p className="text-gray-600">
                    Todos tus pedidos están en buen estado o ya han sido procesados.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Menú
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha del pedido
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado del pedido
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {ordersToCancel.map((order) => (
                        <tr key={order.registro} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-blue-600">
                              {order.nombre_menu}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(order.fecha_pedido)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              SOLICITADO
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button
                              onClick={() => handleCancelOrder(order)}
                              variant="outline"
                              size="sm"
                              disabled={cancelingOrderId === order.registro}
                              className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              {cancelingOrderId === order.registro ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                  Cancelando...
                                </>
                              ) : (
                                'Cancelar'
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};
