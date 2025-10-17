import { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Pagination } from '../components/ui/Pagination';
import { FilterForm } from '../components/ui/FilterForm';
import { StatusLabel } from '../components/ui/StatusLabel';
import { useSolicitudesStore } from '../stores/solicitudesStore';

export const MisSolicitudesPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    menu: '',
    fechaDesde: '',
    fechaHasta: '',
    estado: '',
  });

  const {
    solicitudes,
    currentPage,
    totalPages,
    loading,
    error,
    filters: storeFilters,
    availableMenus,
    fetchSolicitudes,
    updateFilters,
    clearError,
    resetFilterOptions,
  } = useSolicitudesStore();

  const itemsPerPage = 10;

  // Fetch solicitudes on component mount
  useEffect(() => {
    fetchSolicitudes(1, itemsPerPage, storeFilters);
  }, [fetchSolicitudes, itemsPerPage, storeFilters]);

  // Server-side filtering and pagination - no client-side processing needed
  console.log('Solicitudes:', solicitudes);

  const handlePageChange = (page: number) => {
    fetchSolicitudes(page, itemsPerPage, storeFilters);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  const handleSearch = () => {
    // Apply filters and fetch new data
    updateFilters(filters);
    fetchSolicitudes(1, itemsPerPage, filters);
  };

  const handleReset = () => {
    const resetFilters = {
      menu: '',
      fechaDesde: '',
      fechaHasta: '',
      estado: '',
    };
    setFilters(resetFilters);
    updateFilters(resetFilters);
    resetFilterOptions(); // Reset filter options so they reload on next fetch
    fetchSolicitudes(1, itemsPerPage, resetFilters);
    clearError();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      <div className="flex">
        <Sidebar 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        <main className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Page Title */}
            <div className="border-b border-gray-200 pb-3">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Mis solicitudes</h1>
            </div>

            {/* Search Button and Filters */}
            <div className="py-3 sm:py-4 border-b border-gray-200">
              <div className="flex items-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 px-3 py-1.5 text-sm cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <i className={`fa-solid fa-chevron-${showFilters ? 'up' : 'down'} mr-2`}></i>
                  <span className="hidden sm:inline">Realizar búsqueda</span>
                  <span className="sm:hidden">Buscar</span>
                </button>
              </div>
              
              {/* Filter Form */}
              {showFilters && (
                <div className="mt-4">
                  <FilterForm
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                    onReset={handleReset}
                    availableMenus={availableMenus}
                  />
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-xs sm:text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm sm:text-base text-gray-600">Cargando solicitudes...</span>
                </div>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="block lg:hidden">
                  {solicitudes.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {solicitudes.map((solicitud, index) => (
                        <div key={`${solicitud.menu}-${solicitud.fecha_pedido}-${index}`} className="p-4 hover:bg-gray-50">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">{solicitud.menu}</p>
                                <p className="text-xs text-gray-500 mt-1">{solicitud.restaurante}</p>
                              </div>
                              <StatusLabel status={solicitud.estado as any} className="ml-2" />
                            </div>
                            <div className="text-xs text-gray-600">
                              <p><span className="font-medium">Tipo:</span> {solicitud.tipo_servicio}</p>
                              <p className="mt-1"><span className="font-medium">Fecha:</span> {solicitud.fecha_pedido}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-sm text-gray-500">
                      {storeFilters.menu || storeFilters.fechaDesde || storeFilters.fechaHasta || storeFilters.estado
                        ? 'No se encontraron solicitudes que coincidan con los filtros aplicados.'
                        : 'No tienes solicitudes registradas.'}
                    </div>
                  )}
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
                          Restaurante
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo de Servicio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha del pedido
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado del pedido
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {solicitudes.length > 0 ? (
                        solicitudes.map((solicitud, index) => (
                          <tr key={`${solicitud.menu}-${solicitud.fecha_pedido}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {solicitud.menu}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {solicitud.restaurante}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {solicitud.tipo_servicio}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {solicitud.fecha_pedido}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <StatusLabel status={solicitud.estado as any} />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            {storeFilters.menu || storeFilters.fechaDesde || storeFilters.fechaHasta || storeFilters.estado
                              ? 'No se encontraron solicitudes que coincidan con los filtros aplicados.'
                              : 'No tienes solicitudes registradas.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-200">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};
