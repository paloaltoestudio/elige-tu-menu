import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { StatusLabel } from '../components/ui/StatusLabel';
import { FilterForm } from '../components/ui/FilterForm';
import { useAuthStore } from '../stores/authStore';
import { useCancelOrdersStore } from '../stores/cancelOrdersStore';
import { formatDateToSpanish } from '../utils/dateFormat';

export const CancelOrdersPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    menu: '',
    fechaDesde: '',
    fechaHasta: '',
    estado: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    menu: '',
    fechaDesde: '',
    fechaHasta: '',
    estado: ''
  });
  const [availableMenus, setAvailableMenus] = useState<string[]>([]);
  
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

  // Extract unique menus from orders
  useEffect(() => {
    if (ordersToCancel.length > 0) {
      const uniqueMenus = [...new Set(ordersToCancel.map(order => order.nombre_menu))].filter(Boolean).sort();
      setAvailableMenus(uniqueMenus);
    }
  }, [ordersToCancel]);

  // Reset filters on component unmount
  useEffect(() => {
    return () => {
      const resetFilters = {
        menu: '',
        fechaDesde: '',
        fechaHasta: '',
        estado: ''
      };
      setFilters(resetFilters);
      setAppliedFilters(resetFilters);
    };
  }, []);

  const handleCancelOrder = async (order: any) => {
    if (user && token && user.documento) {
      const result = await Swal.fire({
        title: '¿Cancelar pedido?',
        html: `
          <div class="text-left">
            <p class="mb-3"><strong>Fecha:</strong> ${formatDateToSpanish(order.fecha_pedido)}</p>
            <p class="mb-3"><strong>Menú:</strong> ${order.nombre_menu}</p>
            <p class="text-sm text-gray-600">¿Estás seguro de que deseas cancelar este pedido?</p>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, mantener',
        reverseButtons: true
      });
      
      if (result.isConfirmed) {
        await cancelOrder(token, user.documento, order);
        
        // Show success message
        Swal.fire({
          title: '¡Pedido cancelado!',
          text: 'El pedido ha sido cancelado exitosamente.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Entendido'
        });
      }
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      menu: '',
      fechaDesde: '',
      fechaHasta: '',
      estado: ''
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  // Filter orders based on applied filters
  const filteredOrders = ordersToCancel.filter(order => {
    if (appliedFilters.menu && order.nombre_menu !== appliedFilters.menu) return false;
    if (appliedFilters.estado && 'SOLICITADO' !== appliedFilters.estado) return false; // All orders are SOLICITADO
    
    // Date filtering
    if (appliedFilters.fechaDesde || appliedFilters.fechaHasta) {
      const orderDate = new Date(order.fecha_pedido);
      if (appliedFilters.fechaDesde) {
        const desdeDate = new Date(appliedFilters.fechaDesde);
        if (orderDate < desdeDate) return false;
      }
      if (appliedFilters.fechaHasta) {
        const hastaDate = new Date(appliedFilters.fechaHasta);
        if (orderDate > hastaDate) return false;
      }
    }
    
    return true;
  });

  if (loading && ordersToCancel.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        
        <div className="max-w-[1600px] mx-auto">
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
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      <div className="max-w-[1600px] mx-auto">
        <div className="flex">
          <Sidebar 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          
          <main className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Page Title */}
            <div className="border-b border-gray-200 pb-3">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
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
            <div className="py-4 border-b border-gray-200">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <i className={`fa-solid fa-chevron-${showFilters ? 'up' : 'down'} mr-2`}></i>
                Realizar búsqueda
              </Button>
            </div>

            {/* Filter Form - Collapsible */}
            {showFilters && (
              <div className="px-3 sm:px-4 lg:px-6 py-4 border-b border-gray-200 bg-gray-50">
                <FilterForm
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onSearch={handleSearch}
                  onReset={handleReset}
                  availableMenus={availableMenus}
                />
              </div>
            )}

            {/* Orders Table */}
            <div>
              {loading && ordersToCancel.length === 0 ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando pedidos...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fa-solid fa-check-circle text-4xl text-green-500 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay pedidos para cancelar
                  </h3>
                  <p className="text-gray-600">
                    Todos tus pedidos ya han sido procesados.
                  </p>
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="block lg:hidden space-y-4">
                    {filteredOrders.map((order) => (
                      <div key={order.registro} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex flex-col justify-between items-start mb-3">
                          <div className="flex-1 mb-3">
                            <h3 className="text-sm font-medium text-blue-600 mb-1">
                              {order.nombre_menu}
                            </h3>
                            <p className="text-xs text-gray-500">
                              Fecha: {formatDateToSpanish(order.fecha_pedido)}
                            </p>
                          </div>
                          <StatusLabel status="SOLICITADO" />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            onClick={() => handleCancelOrder(order)}
                            variant="outline"
                            size="sm"
                            disabled={cancelingOrderId === order.registro}
                            className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 text-xs px-3 py-1"
                          >
                            {cancelingOrderId === order.registro ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                                Cancelando...
                              </>
                            ) : (
                              'Cancelar'
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
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
                        {filteredOrders.map((order) => (
                          <tr key={order.registro} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-blue-600">
                                {order.nombre_menu}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDateToSpanish(order.fecha_pedido)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <StatusLabel status="SOLICITADO" />
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
                </>
              )}
            </div>
          </div>
        </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
