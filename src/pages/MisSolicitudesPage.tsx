import { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Pagination } from '../components/ui/Pagination';
import { FilterForm } from '../components/ui/FilterForm';
import { useSolicitudesStore } from '../stores/solicitudesStore';

export const MisSolicitudesPage = () => {
  const [showFilters, setShowFilters] = useState(false);
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
    fetchSolicitudes,
    updateFilters,
    clearError,
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
    fetchSolicitudes(1, itemsPerPage, resetFilters);
    clearError();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Page Title */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">Mis solicitudes</h1>
            </div>

            {/* Search Button and Filters */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <span>Realizar búsqueda</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
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
                  />
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="px-6 py-8">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Cargando solicitudes...</span>
                </div>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="overflow-x-auto">
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
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {solicitud.estado}
                              </span>
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
                  <div className="px-6 py-4 border-t border-gray-200">
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
