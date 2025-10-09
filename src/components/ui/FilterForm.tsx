interface FilterFormProps {
  filters: {
    menu: string;
    fechaDesde: string;
    fechaHasta: string;
    estado: string;
  };
  onFilterChange: (filters: {
    menu: string;
    fechaDesde: string;
    fechaHasta: string;
    estado: string;
  }) => void;
  onSearch: () => void;
  onReset: () => void;
  availableMenus?: string[];
}

export const FilterForm = ({ 
  filters, 
  onFilterChange, 
  onSearch, 
  onReset,
  availableMenus = []
}: FilterFormProps) => {
  const menuOptions = [
    { value: '', label: '-- Seleccione Menú --' },
    ...availableMenus.map(menu => ({ value: menu, label: menu }))
  ];

  // Static estado options
  const estadoOptions = [
    { value: '', label: '-- Seleccione Estado del pedido --' },
    { value: 'SOLICITADO', label: 'SOLICITADO' },
    { value: 'DESPACHADO', label: 'DESPACHADO' },
    { value: 'CANCELADO', label: 'CANCELADO' },
    { value: 'EN NOVEDAD', label: 'EN NOVEDAD' },
  ];

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Row */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">
            Menú:
          </label>
          <select
            value={filters.menu}
            onChange={(e) => onFilterChange({ ...filters, menu: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {menuOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">
            Fecha del pedido:
          </label>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 bg-gray-300 text-gray-700 rounded text-sm font-medium">
              De
            </button>
            <input
              type="date"
              value={filters.fechaDesde}
              onChange={(e) => onFilterChange({ ...filters, fechaDesde: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="px-3 py-2 bg-gray-300 text-gray-700 rounded text-sm font-medium">
              A
            </button>
            <input
              type="date"
              value={filters.fechaHasta}
              onChange={(e) => onFilterChange({ ...filters, fechaHasta: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">
            Estado del pedido:
          </label>
          <select
            value={filters.estado}
            onChange={(e) => onFilterChange({ ...filters, estado: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {estadoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div></div> {/* Empty cell for grid alignment */}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3 mt-4">
        <button
          onClick={onSearch}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Buscar</span>
        </button>
        
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reiniciar búsqueda</span>
        </button>
      </div>
    </div>
  );
};
